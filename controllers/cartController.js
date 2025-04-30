const Cart = require('../models/Cart');
const Product = require('../models/Products');

const addToCart = async(req,res) => {
    const {productId, quantity} = req.body;

    try{
        const product = await Product.findById(productId);
        if(!product) {
            return res.status(404).json({message:'Product not found'});
        }
        
        console.log("req.user:", req.user);

        let cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");


        if (!cart) {
            console.log("Creating new cart with userId:", req.user._id);
            cart = new Cart({ userId: req.user._id, items: [] }); 
        }
          
        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if(existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({productId, quantity});
        }

        await cart.save();
        await cart.populate("items.productId");
        res.status(200).json(cart);
    } catch(error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({message: 'failed to add to cart', error: error.message});
    }
    
};



const updateCartItem = async (req,res) => {
    const {quantity} = req.body;
    const productId = req.params.productId;

    try{
        const cart = await Cart.findOne({userId: req.user.id});
        if(!cart) {
            return res.status(404).json({message: 'cart not found'});
        }

        const item = cart.items.find(item=> item.productId.equals(productId));
        if(!item) {
            return res.status(404).json({message: 'Items not found in cart'});
        }

        item.quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
    } catch(error) {
        res.status(500).json({message: 'Failed to update cart item'});
    }
};


const removeFromCart = async (req,res) => {
    const productId = req.params.productId;

    try {
       const cart = await Cart.findOne({userId: req.user.id});
       if(!cart) {
        return res.status(404).json({message: 'Cart not found'});
       }

       cart.items = cart.items.filter(item => !item.productId.equals(productId));
       await cart.save();

       res.status(200).json(cart);
    } catch(error) {
        res.status(500).json({message: 'Failed to remove from cart'});
    }
};

const getUserCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }).populate("items.product");
        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [] });
            return res.status(200).json({ data: cart, message: "Cart is empty" });
        }
        res.status(200).json({ data: cart });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToCart,
    updateCartItem,
    removeFromCart,
    getUserCart
};