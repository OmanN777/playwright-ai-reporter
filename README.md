# 🤖 AI-Augmented QA Portfolio

Welcome to the **AI-Augmented QA Portfolio**! This repository showcases a Playwright automation framework built with TypeScript, featuring a Page Object Model (POM) architecture, API testing, Visual Regression testing, Network Interception, and a **Custom AI Reporter** powered by Google's Gemini.

## 🌟 Key Features

*   **Custom AI Reporter (`ai_reporter.ts`)**: Automatically analyzes failed tests using the Gemini 3.5 Flash model and generates a clear, actionable markdown report (`ai-failure-report.md`) containing the Root Cause and Quick Fix.
*   **API Automation**: CRUD testing utilizing mock backends (JSONPlaceholder).
*   **UI/E2E Automation**: End-to-end user flows targeting dummy environments (SauceDemo) structured via the Page Object Model (POM) design pattern.
*   **Network Mocking**: Demonstrates the ability to isolate frontend tests by intercepting network requests and mocking JSON responses.
*   **Visual Regression Testing**: Automated pixel-perfect comparisons to catch unintended CSS or layout changes.
*   **CI/CD Integration**: GitHub Actions pipeline (`playwright.yml`) that runs tests automatically and attaches the AI Failure Report to Pull Requests.

## 🛠️ Technology Stack

*   **Framework:** [Playwright](https://playwright.dev/)
*   **Language:** TypeScript
*   **AI Engine:** [Google Generative AI (Gemini)](https://ai.google.dev/)
*   **CI/CD:** GitHub Actions

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
```bash
# Install NPM dependencies
npm install

# Install Playwright browsers (Chromium & WebKit only)
npx playwright install chromium webkit --with-deps
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Gemini API key to enable the AI Reporter:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🧪 Running Tests

You can run the entire test suite or specific tests using Playwright's CLI.

```bash
# Run all tests (API, UI, Visual, Mocking)
npx playwright test

# Run only API tests
npx playwright test tests/api/

# Run only UI tests
npx playwright test tests/ui/

# View the HTML test report
npx playwright show-report
```

## 🧠 How the AI Reporter Works

When a test fails (e.g., due to a changed locator or API returning 500), the standard console output can be noisy. Our custom reporter (`utils/ai_reporter.ts`) intercepts the failure:
1. It sends the error stack trace to the **Gemini 3.5 Flash** model.
2. The AI analyzes the error and generates a report in `ai-failure-report.md`.
3. In a CI/CD environment, GitHub Actions will automatically post this markdown report as a comment on the failing Pull Request to help with debugging.

---
*Created by [OmanN777]*
