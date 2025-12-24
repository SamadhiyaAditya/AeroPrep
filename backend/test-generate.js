const axios = require('axios');

async function testGenerate() {
  try {
    console.log('Sending request to generate questions...');
    const response = await axios.post('http://localhost:3000/generate-questions', {
      resumeURL: 'https://ik.imagekit.io/rqjoehsd7/Rishi%20Resume.pdf' // Public dummy PDF
      // I need a real accessible pdf url. I'll use a dummy one or ask the user.
      // The user provided 'https://example.com/path/to/resume.pdf' in their prompt.
      // I'll use a known public PDF for testing if possible, or just expect it to fail safely if the URL is bad.
      // Let's use a sample dummy PDF online if I can find one or just use the user's example and expect a download error if invalid.
      // Actually, standard practice: I'll try to find a sample resume pdf url or just use a placeholder that will likely fail but verify proper error handling. 
      // Better: I'll comment that the user needs to put a real URL.
    });
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testGenerate();
