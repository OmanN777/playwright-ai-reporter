require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('No API key found in .env');
      return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('Fetching available models...');
    
    // Unfortunately, the @google/generative-ai JS SDK doesn't natively expose listModels directly on the main class in some versions,
    // but we can fetch it via standard REST API if needed.
    // Let's use the REST API to be safe.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log('Available models:');
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes('generateContent')) {
           console.log(`- ${m.name}`);
        }
      });
    } else {
      console.log('Error fetching models:', data);
    }
  } catch (error) {
    console.error('Failed:', error);
  }
}

listModels();
