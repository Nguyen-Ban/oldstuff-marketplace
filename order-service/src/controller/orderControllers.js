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

            const product = await axios.get(`${process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002'}/get-public-product/${productId}`)
                .then(response => response.data)
                .catch(error => {
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
                price: itemTotalPrice
            });
        }

        const order = new Order({
            userId: req.user.id,
            totalPrice
        });

        await order.save();

        // Save order items
        for (const orderItem of orderItems) {
            await OrderItem.create({
                orderId: order.id,
                ...orderItem
            });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getOrderByUser = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{ model: OrderItem }]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
