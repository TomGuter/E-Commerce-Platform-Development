var express = require('express');
var router = express.Router();
const list = require('./list.json');
const totalpay = require('./cart.json');
const navbar = require('./navbar.json');
const products = require('./data.json');
const selectedProducts = require('./checkout.json');
const fs = require('fs');
const path = require('path');



const mongoose = require('mongoose');
const Product = require('../models/page');
const Cart = require('../models/cart');
const ordersOfAll = require('../models/order');
const Price = require('../models/addedPrice');
const Contact = require('../models/contact');
const { log } = require('console');
const { isLogin } = require('../middleware/isLoginMiddleware');




var cartData = {
  totalSum: 0
};


router.post('/prod', async (req, res) => {

  const productData = req.body;
  const product = new Product(productData);
  await product.save();

  // const products = await Product.find(); // to show to products

});
// remove product from checkout cart
router.post('/remove-product-checkout', async (req, res) => {
  const { productId } = req.body;


  await Cart.findByIdAndRemove(productId);

  res.sendStatus(200); // send a confirm status code

});

router.post('/checkoutSum', async (req, res, next) => {
  try {
    const productData = req.body;
    const currPrice = await Price.findOne({});

    let totalSum = productData.totalSum;

    if (currPrice) {
      totalSum += currPrice.totalSum;
    }

    await Price.findOneAndUpdate({}, { totalSum }, { upsert: true });
    res.sendStatus(200); // send a confirm status code
  }
  catch {
    res.sendStatus(500); // send an error status code
  }
});

router.post('/checkoutSumRemove', async (req, res, next) => {

  const productData = req.body;
  const productId = productData.productId;

  const cartProduct = await Cart.findOne({ productId });

  if (!cartProduct) {
    return res.sendStatus(404);  // product doesn't exist in the "Cart"
  }

  const currPrice = await Price.findOne({});
  let totalSum = productData.totalSum;

  if (currPrice) {
    totalSum = currPrice.totalSum - totalSum;
  }
  if (totalSum < 0) {
    totalSum = 0;
  }
  await Price.findOneAndUpdate({}, { totalSum }, { upsert: true });
  res.sendStatus(200);

});




// remove all products from checkout cart
router.post('/remove-all', async (req, res) => {
  try {
    await Product.updateMany({}, { $set: { quantity: 0, payment: 0 } }); // to update all the products to their default values
    await Cart.deleteMany();

    res.status(200).json({ message: 'product removed' });
  }
  catch (error) {
    console.error('error removing product', error);

  }
});



router.post('/checkoutSumReset', async (req, res, next) => {

  const productData = req.body;
  const currPrice = await Price.findOne({});
  let totalSum = productData.totalSum;

  if (currPrice) {
    totalSum = 0.00;
  }
  await Price.findOneAndUpdate({}, { totalSum }, { upsert: true });
  res.sendStatus(200);

});

// remove product from database
router.post('/remove-product', async (req, res) => {
  try {
    const { productId } = req.body;

    await Product.findByIdAndRemove(productId);

    res.sendStatus(200);
  }
  catch {
    res.sendStatus(500);
  }
});

router.post('/delete-message', async (req, res) => {
  try {
    const { messageId } = req.body;
    await Contact.deleteOne({ _id: messageId });
    res.json({ success: true });
  }

  catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

router.get('/', isLogin, async (req, res, next) => {
  const products = await Product.find();
  const total = await Price.find();
  const user = res.user;
  const token = res.token;
  res.render('pages/home', { products, total, navbar, user,token });
});

//check if needed
// router.get('/', isLogin, async (req, res, next) => {
//   const products = await Product.find();
//   const user = res.user;
//   res.render('pages/home', { products, navbar, totalSum: cartData.totalSum, user });
// });

// router.get('/about', async (req, res, next) => {
//   // const ordersOfAll = await Order.find();
//   res.render('pages/about', { navbar });
// });

router.get('/about', async (req, res, next) => {
  try {

    const orders = await ordersOfAll.find();


    let totalSum = 0;
    orders.forEach((order) => {
      totalSum += order.price * order.quantity;
    });

    res.render('pages/about', { navbar, totalSum });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).render('error', { navbar });
  }
});

router.get('/contact', function (req, res, next) {
  res.render('pages/contact', { navbar });
});

router.get('/product', function (req, res, next) {
  res.render('pages/product', { navbar });
});

router.get('/search', function (req, res, next) {
  res.render("pages/search");
})

router.get('/searchdata', async function (req, res, next) {
  const param = new RegExp(req.query.term, 'i')
  const products = await Product.find({ title: param }, 'title');
  const prodtitle = products.map(product => product.title)
  res.status(200).json(prodtitle);
})

router.get('/checkout', isLogin, async (req, res, next) => {
  const products = await Cart.find();
  const total = await Price.find();
  const token = res.token
  const user = res.user
  res.render('pages/checkout', { products, total, navbar, token, user });
});

router.get('/finalStepToPay', isLogin, async (req, res, next) => {
  const products = await Cart.find();
  const total = await Price.find();
  const token = res.token
  const user = res.user
  res.render('pages/finalStepToPay', { products, total, navbar, token, user });
});

router.get('/add', function (req, res, next) {
  res.render('pages/add', { navbar });
});

router.post('/contactUs', async (req, res, next) => { // send the request to mongdb

  try {
    const contactUs = req.body;
    const message = new Contact(contactUs);
    await message.save(); // save the request in mongodb
    res.send('<script>alert("Your request was sent successfully"); window.location.href = "/contact";</script>'); // give an alert to the client and then refresh the page

  }
  catch (error) {
    res.sendStatus(500);
  }
});

router.post('/checkoutCart', async (req, res, next) => {

  const productData = req.body;
  const productId = productData.productId;
  const quantity = productData.quantity;
  const title = productData.title;


  // upadate the total quantity per product after click add to cart
  try {
    const { quantity, payment, title } = req.body;
    await Product.findOneAndUpdate({ title }, { quantity, payment }, { new: true });
  }
  catch (error) {
    res.sendStatus(500);
  }



  const productExist = await Cart.findOne({ title });
  console.log(productExist);

  if (productExist && quantity == 0) { // for a case the user try to add a product with 0 wuantity
    await Cart.findOneAndRemove({ title });
    res.sendStatus(200);
  }
  else if (productExist && productExist.quantity > 0) {

    productExist.quantity = quantity;
    await productExist.save();
    res.sendStatus(200); // send a success status code
  }
  else if (!productExist && quantity > 0) {

    const checkoutCart = new Cart(productData);
    await checkoutCart.save();
    res.sendStatus(200); // send a success status code
  }
  else {
    res.sendStatus(500); // send an error status code
  }

});




module.exports = router;
