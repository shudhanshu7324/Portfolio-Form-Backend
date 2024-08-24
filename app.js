import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


// middleware
app.use(cors());
app.use(bodyParser.json());


// Define a Mongoose schema
const formDataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactno: { type: String, required: true },
    message: { type: String, required: true }
});

// Create a model
const FormData = mongoose.model('FormData', formDataSchema);

// Route to handle form submission
app.post('/submit', async (req, res) => {
    const { name, email, contactno, message } = req.body;

    if (!name || !email || !contactno || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Save form data to MongoDB
        const formData = new FormData({ name, email, contactno, message });
        await formData.save();

        // Send success response
        res.status(201).json({ message: 'Form data saved successfully', data: formData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save form data' });
    }
});

// Route to get all form data (optional)
app.get('/form-data', async (req, res) => {
    try {
        const formDataList = await FormData.find();
        res.json(formDataList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve form data' });
    }
});

app.get('/',(req,res)=>{
    res.send("Hello");
})


app.listen(process.env.PORT || 4000,()=>{
    console.log("server is running on port 4000");
})