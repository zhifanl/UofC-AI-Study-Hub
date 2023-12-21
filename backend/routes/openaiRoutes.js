const express = require('express');
const { generateResponse } = require('../ai/openaiAPI.js');
const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    const response = await generateResponse(prompt);
    // console.log(response.choices)
    res.json({ response: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
