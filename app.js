const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');

const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware (always after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
