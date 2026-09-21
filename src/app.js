require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const propertyRoutes = require('./routes/propertyRoutes');
const verificationRoutes = require('./routes/verificationRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('PropMart API running'));

app.get('/api/protected', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'You have access to this protected route',
    user: req.user
  });
});

app.use('/api', authRoutes);
app.use('/api', propertyRoutes);
app.use('/api', verificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));