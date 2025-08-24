const BlindBox = require('../model/blindbox');
const BlindBoxItem = require('../model/blindboxItem');
const axios = require('axios');

exports.createBlindBox = async (req, res) => {
    try {
        const { topic, minPrice, maxPrice } = req.body;
        
        const products = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL || "http://localhost:3002"}/products?topic=${topic}&minPrice=${minPrice}&maxPrice=${maxPrice}`
    ).then(res => res.data);
    if (!products || products.length < 5) {
      return res.status(400).json({ error: "Không đủ sản phẩm để tạo blind box" });
    }

    const selected = products.sort(() => 0.5 - Math.random()).slice(0, 5);

    const blindBox = await BlindBox.create({
      topic,
      minPrice,
      maxPrice,
      createdBy: req.user.id
    });

    const blindBoxItems = selected.map(product => ({
      blindboxId: blindBox.id,
      productId: product.id
    }));

    await BlindBoxItem.bulkCreate(blindBoxItems);

    res.status(201).json(blindBox);
  } catch (error) {
    console.error("Error creating blind box:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.pickFromBlindBox = async (req, res) => {
  try {
    const { blindBoxId } = req.params;

    // Find the blind box and its items
    const blindBox = await BlindBox.findByPk(blindBoxId, {
      include: [BlindBoxItem]
    });

    if (!blindBox) {
      return res.status(404).json({ error: "Blind box not found" });
    }

    // Pick a random item from the blind box
    const randomItem = blindBox.BlindBoxItems[Math.floor(Math.random() * blindBox.BlindBoxItems.length)];

    const product = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL || "http://localhost:3002"}/get-public-product/${randomItem.productId}`
    ).then(res => res.data);

    const order = await axios.post(
      `${process.env.ORDER_SERVICE_URL || "http://localhost:3003"}/create`,
      {
        items: [
          {
            productId: product.id,
            quantity: 1
          }
        ],
      },
      {
        headers: { Authorization: req.headers.authorization }
      }
    ).then(res => res.data);

    res.status(200).json({ product, order });
  } catch (error) {
    console.error("Error picking from blind box:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
