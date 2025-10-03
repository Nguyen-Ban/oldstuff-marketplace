const Product = require('../model/product');
const { Op } = require('sequelize');

exports.createProduct = async (req, res) => {
  if (req.user.role === 'buyer') {
    return res.status(403).json({ error: 'Only sellers can create products' });
  }

  try {
    let imageUrl;
    if (req.file) {
      // multer-storage-cloudinary gắn trực tiếp secure_url
      imageUrl = req.file.path; 
    }

    const product = await Product.create({
      ...req.body,
      userId: req.user.id,
      imageUrl
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role === 'buyer') {
      return res.status(403).json({ error: 'Only sellers can delete products' });
    }

    const product = await Product.findOne({
        where: {
            id,
            userId: req.user.id
        }
    })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProductBySeller = async (req, res) => {
    try {
    if (req.user.role === 'buyer') {
      return res.status(403).json({ error: 'Only sellers can view their product list' });
    }

    const products = await Product.findAll({
      where: { userId: req.user.id }
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getPublicProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id, { attributes: ['id', 'name', 'price', 'imageUrl', 'category', 'description'] });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPublicAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'name', 'price', 'imageUrl', 'category', 'description']
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role === 'buyer') {
      return res.status(403).json({ error: 'Only sellers can delete products' });
    }

    const product = await Product.findOne({
        where: {
            id,
            userId: req.user.id
        }
    })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;

    try {
        if (req.user.role === 'buyer') {
            return res.status(403).json({ error: 'Only sellers can update products' });
        }

        const product = await Product.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let imageUrl;
        if (req.file) {
          imageUrl = req.file.path;
          req.body.imageUrl = imageUrl;
        }

        const updatedProduct = await product.update(req.body);
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductsByFilter = async (req, res) => {
  try {
    const { topic, minPrice, maxPrice } = req.query;

    const where = {};

    if (topic) {
      where.category = topic;
    }

    if (minPrice && maxPrice) {
      where.price = {
        [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
      };
    } else if (minPrice) {
      where.price = {
        [Op.gte]: parseFloat(minPrice)
      };
    } else if (maxPrice) {
      where.price = {
        [Op.lte]: parseFloat(maxPrice)
      };
    }

    const products = await Product.findAll({
      where,
      limit: 5
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};