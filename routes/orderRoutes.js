// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const DeletedOrder = require('../models/DeletedOrder');
const Service = require('../models/Service');

// GET: Barcha buyurtmalarni olish
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: 'services',
      populate: { path: 'category_id', select: 'name' }, // Kategoriya nomini olish
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Buyurtmalarni olishda xatolik', error: error.message });
  }
});

// DELETE: Buyurtmani o‘chirish
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // O‘chirish sababi kiritilganligini tekshirish
    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'O‘chirish sababi kiritilishi shart' });
    }

    const order = await Order.findById(id).populate({
      path: 'services',
      populate: { path: 'category_id', select: 'name' },
    });

    if (!order) {
      return res.status(404).json({ message: 'Buyurtma topilmadi' });
    }

    // Buyurtmani o‘chirish
    await Order.findByIdAndDelete(id);

    // O‘chirilgan buyurtmani saqlash
    const deletedOrderData = {
      originalOrderId: order._id,
      total_price: order.services.reduce((sum, service) => sum + service.price, 0),
      services: order.services,
      date: order.date,
      deletionReason: reason.trim(),
      deletedAt: new Date(),
    };

    const deletedOrder = new DeletedOrder(deletedOrderData);
    await deletedOrder.save();

    res.status(200).json({ message: 'Buyurtma muvaffaqiyatli o‘chirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Buyurtma o‘chirishda xatolik', error: error.message });
  }
});

module.exports = router;