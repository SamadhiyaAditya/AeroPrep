require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAI() {
  try {
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('API Key prefix:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'MISSING');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in .env file!');
      return;
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const resumeText = 'EDUCATION InkSpire OBJECTIVE SKILLS Foodie Hub ReactJS, Parcel, Vercel, TailwindCSS Built a responsive Swiggy-inspired UI...';
    
    const prompt = `You are an expert technical interviewer. Based on the candidate's resume, generate exactly 3 interview questions.
    
    Return the response as a JSON array where each object has "question" and "answer" fields.
    Example format: [{"question": "...", "answer": "..."}]
    
    RESUME TEXT:
    ${resumeText}
    `;
    
    console.log('Sending to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Response received:', text.substring(0, 500));
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Full error:', error);
  }
}

testAI();
