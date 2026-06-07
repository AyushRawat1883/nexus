const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const ticketRoutes = require('./routes/ticketRoutes.js');

// Load environment variables
dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to parse JSON payloads
//route links
app.use('/api/auth', authRoutes);

app.use('/api/tickets', ticketRoutes);

// Root Test Route
app.get('/', (req, res) => {
    res.send('NEXUS API Backend is active.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🎯 Server running on port ${PORT}`));