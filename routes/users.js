var express = require('express');
var router = express.Router();
const navbar = require('./navbar.json');
const cartModel = require('../models/cart');
const UserModel = require('../models/user')
const orderModel = require('../models/order')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware')
const { isLogin } = require('../middleware/isLoginMiddleware');
const axios = require('axios')

/* GET users listing. */
router.get('/', protect, async (req, res, next) => {
  const user = res.user
  await user.populate('order');
  res.render('user/userpage', { navbar, user });

});

router.get('/clearOrders', protect, async (req, res, next) => {
  const user = res.user;
  await orderModel.deleteMany({ 'user': user._id });
  await user.updateOne({ 'order': [] });
  await user.updateOne({ 'numOfOrders': 0 })
  res.redirect('/users');
})

router.get('/login', isLogin, function (req, res, next) {
  const message = req.cookies.message
  res.clearCookie('message')
  res.render('user/loginpage', { navbar,message })
})

router.post('/login', isLogin, async function (req, res, next) {
  const mail = req.body.mail;
  user = await UserModel.findOne({ mail: mail })
  if (user && user.password === req.body.password) {
    res.cookie('token', generateToken(user._id))
    res.redirect('/users');
  } else {
    res.cookie('message','Invalid details')
    res.redirect('/users/login')
  }
})

router.get('/signin', isLogin, function (req, res, next) {
  const message = req.cookies.message
  res.clearCookie('message')
  res.render('user/signinpage', { navbar,message })
})

router.post('/signin', isLogin, async function (req, res, next) {
  try {
    const userData = req.body;
    const user = new UserModel(userData)
    await user.save();
    res.cookie('token', generateToken(user._id))
    res.redirect('/')
  }
  catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const err = Object.keys(error.keyValue)[0];
      res.cookie('message',`${err} already exists`)
    }else{
      res.cookie('message',`Password is too short! Insert at least 6 digits`)
    }
    res.redirect('/users/signin');
  }
})

router.get("/logout", protect, function (req, res, next) {
  res.clearCookie('token')
  res.redirect('/')
})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

router.post('/confirmation', protect, async function (req, res, next) {

  if (!req.body.prodTitle) {
    res.redirect('/')
    return
  }

  const user = res.user;
  user.numOfOrders++;
  for (let i = 0; i < req.body.prodQuantity.length; i++) {
    if (req.body.prodQuantity.length === 1) {
      const order = new orderModel({
        product: req.body.prodTitle,
        price: req.body.prodPrice,
        quantity: req.body.prodQuantity,
        user: user._id,
        orderNo: user.numOfOrders
      })
      user.order.push(order._id);
      await order.save();
      await user.updateOne(user);
      break;
    }
    const order = new orderModel({
      product: req.body.prodTitle[i],
      price: req.body.prodPrice[i],
      quantity: req.body.prodQuantity[i],
      user: user._id,
      orderNo: user.numOfOrders
    })
    user.order.push(order._id);
    await order.save();
    await user.updateOne(user);
    
  }
  await axios.post('http://localhost:3000/checkoutSumReset')
  await axios.post('http://localhost:3000/remove-all')

  res.render('user/confirmation', { navbar });
});


module.exports = router;
