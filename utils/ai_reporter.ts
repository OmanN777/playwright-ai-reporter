import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';

class AIReporter implements Reporter {
  private failedTests: { title: string, error: string }[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed' || result.status === 'timedOut') {
      const errorMsg = result.error?.message || result.error?.stack || 'Unknown error';
      this.failedTests.push({
        title: test.title,
        error: errorMsg
      });
    }
  }

  async onEnd(result: any) {
    if (this.failedTests.length === 0) {
      console.log('✅ All tests passed! No AI analysis needed.');
      return;
    }

    console.log(`\n🤖 AI is analyzing ${this.failedTests.length} failed tests...`);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('⚠️ GEMINI_API_KEY is missing. Skipping AI Analysis. Please set it to enable AI-Augmented QA.');
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // ใช้ gemini-3.5-flash เพราะเป็น version ล่าสุด
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

      let analysisReport = '# 🤖 AI-Augmented QA Failure Report\n\n';

      for (const failedTest of this.failedTests) {
        const prompt = `
        You are a Senior QA Automation Engineer. Analyze the following Playwright test failure.
        Determine the appropriate length for your explanation based on the complexity of the issue. Keep it concise, easy to read, and easy to understand. Do not make it overly long.
        Use the following exact format:
        
        - 🚨 **Issue:** (Describe the exact failure clearly)
        - 🔍 **Root Cause:** (Explain the underlying technical reason)
        - 🛠️ **Quick Fix:** (Provide actionable steps, code snippets, or debugging tips to resolve it)
        
        Test Title: ${failedTest.title}
        Error Details: ${failedTest.error}
        `;

        const response = await model.generateContent(prompt);
        const text = response.response.text();
        
        analysisReport += `## Test: ${failedTest.title}\n`;
        analysisReport += `${text}\n\n---\n\n`;
      }

      fs.writeFileSync('ai-failure-report.md', analysisReport);
      console.log('✅ AI Analysis complete! Check ai-failure-report.md');
    } catch (error: any) {
      console.log('⚠️ Google AI API is currently overloaded or unavailable (503). Generating fallback report...');
      let fallbackReport = '# 🤖 AI-Augmented QA Failure Report\n\n';
      fallbackReport += '> **Notice:** The AI analysis could not be completed because the Gemini API is currently experiencing high demand (Error 503). Below are the raw error logs for manual inspection.\n\n';
      for (const failedTest of this.failedTests) {
        fallbackReport += `## Test: ${failedTest.title}\n`;
        fallbackReport += `**Error Log:**\n\`\`\`\n${failedTest.error}\n\`\`\`\n\n---\n\n`;
      }
      fs.writeFileSync('ai-failure-report.md', fallbackReport);
      console.log('✅ Fallback Report generated! Check ai-failure-report.md');
    }
  }
}

export default AIReporter;
