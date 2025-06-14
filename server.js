// index.js (bosh qismi yangilandi)
require('dotenv').config(); // .env faylini o‘qish uchun qo‘shildi
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deletedOrderRoutes = require('./routes/deletedOrderRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept'],
}));
app.use(express.json());

// MongoDB ulanishi
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Atlas ga ulandi'))
  .catch((err) => console.error('MongoDB ulanish xatosi:', err));

// Routerlarni ulash
app.use('/category', categoryRoutes);
app.use('/service', serviceRoutes);
app.use('/order', orderRoutes);
app.use('/deleted-orders', deletedOrderRoutes);

// Serverni ishga tushirish
app.listen(port, () => {
  console.log(`Server ${port}-portda ishlamoqda`);
});