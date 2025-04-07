// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { marked } = require('marked');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyCCAx9ca3PAai2CH9E_YgA5qTu2TkcMaNw");

// Endpoint to handle image + text critique
app.post('/analyze', upload.single('image'), async (req, res) => {
  const userText = req.body.prompt;
  const imagePath = req.file.path;

  try {
    const imageData = fs.readFileSync(imagePath);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


    const result = await model.generateContent([
      userText,
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: imageData.toString('base64'),
        },
      },
    ]);
    const rawResponse = result.response.text();
    const response = marked(rawResponse);
    res.json({ reply: response });

    fs.unlinkSync(imagePath); // delete uploaded file after use
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing image." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
