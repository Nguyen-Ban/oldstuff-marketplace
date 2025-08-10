const Product = require('../model/product');

exports.createProduct = async (req, res) => {
   if (req.user.role !== 'seller') {
    return res.status(403).json({ error: 'Only sellers can create products' });
  }

  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role !== 'seller') {
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
    if (req.user.role !== 'seller') {
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

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role !== 'seller') {
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
        if (req.user.role !== 'seller') {
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

        const updatedProduct = await product.update(req.body);
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
