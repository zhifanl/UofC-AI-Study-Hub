const { OpenAI } = require('openai');

async function generateResponse(prompt) {
    try {
        const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 64,
            top_p: 1,
        });
        console.log(response.choices[0].message.content)
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error in generating response:', error);
        throw error;
    }
}

module.exports = { generateResponse };
