const Order = require('../model/order')
const OrderItem = require('../model/orderItem');
const axios = require('axios')

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, quantity } = item;

      const product = await axios
        .get(
          `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002'}/get-public-product/${productId}`
        )
        .then((response) => response.data)
        .catch((error) => {
          console.error('Error fetching product:', error);
          throw new Error('Could not fetch product');
        });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const itemTotalPrice = product.price * quantity;
      totalPrice += itemTotalPrice;

      orderItems.push({
        productId,
        quantity,
        price: itemTotalPrice,
        product // lưu thêm product để trả về client
      });
    }

    // Tạo order
    const order = await Order.create({
      userId: req.user.id,
      totalPrice,
      status: 'pending'
    });

    // Lưu order items
    for (const orderItem of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: orderItem.productId,
        quantity: orderItem.quantity,
        price: orderItem.price
      });
    }

    // Trả về order đầy đủ (bao gồm items + product info)
    const fullOrder = {
      ...order.dataValues,
      OrderItems: orderItems
    };

    res.status(201).json(fullOrder);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getOrderByUser = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{ model: OrderItem }]
        });

        for (const order of orders) {
            for (const item of order.OrderItems) {
                const product = await axios.get(`${process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002'}/get-public-product/${item.productId}`);
                item.dataValues.product = product.data;
            }
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.status = status;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderItemsByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const orderItems = await OrderItem.findAll({
            where: { orderId }
        });
        res.json(orderItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
