const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();  // Load environment variables

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Server is running now!")
})

app.use('/api/users', userRoutes);  // Mount user routes

// MongoDB Connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
