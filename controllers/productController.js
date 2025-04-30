const Product = require('../models/Products');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

const createProduct = async (req,res)=>{
  try {
      const {name,description,stockQuantity,price} = req.body;

      const newProduct = {
          name,
          description,
          price,
          stockQuantity,
          
      }
      const createdProduct = await Product.create(newProduct);
      console.log("created product", createdProduct);
      res.status(201).json({  message : "Product Created Successfully", data: createdProduct });
    }catch (error) {
      console.error(error.message || "Product not created");
      res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct
};
