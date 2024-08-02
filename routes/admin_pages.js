// routes for the admin pages
var express = require('express');
var router = express.Router();
const list = require('./list.json');
const navbar = require('./navbar.json');
const FB = require('fb');
const ordersOfAll = require('../models/order');

const mongoose = require('mongoose');
const Product = require('../models/page');
const Contact = require('../models/contact');


// router.get('/', function (req, res, next) {
//     res.send('This is the admin area');

// });

router.get('/', (req, res, next) => {

    res.render('admin/admin', { navbar });
});





router.post('/prod', async (req, res) => {

    const productData = req.body;
    const product = new Product(productData);
    await product.save();

    const products = await Product.find(); // retrieve all products

});



router.post('/remove-product', async (req, res) => {
    try {
        const { productId } = req.body;


        await Product.findByIdAndRemove(productId);

        res.sendStatus(200);
    }
    catch
    {
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





router.get('/add-product', function (req, res, next) {

    res.render('admin/add_product', { navbar });

});




router.get('/delete-product', async (req, res, next) => {
    const products = await Product.find();
    res.render('admin/delete-product', { products, navbar });
});




router.get('/watch-requstes', async (req, res, next) => {

    const contacts = await Contact.find();

    res.render('admin/watch-requstes', { contact: contacts, navbar });
});



// router.get('/statistics', async (req, res, next) => {


//     res.render('admin/statistics', { navbar });
// });




router.get('/statistics', async (req, res, next) => {
    try {

        const orders = await ordersOfAll.find();


        let totalSumOfJanuary = 0;
        let totalSumOfFebruary = 0;
        let totalSumOfMarch = 0;
        let totalSumOfApril = 0;
        let totalSumOfMay = 0;
        let totalSumOfJune = 0;
        let totalSumOfJuly = 0;
        let totalSumOfAugust = 0;
        let totalSumOfSeptember = 0;
        let totalSumOfOctober = 0;
        let totalSumOfNovember = 0;
        let totalSumOfDecember = 0;
        let totalOfAllSofar = 0;


        var targetMonth = 0;

        targetMonth = 0;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfJanuary += order.price * order.quantity;
            }
        });






        targetMonth = 1;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfFebruary += order.price * order.quantity;
            }
        });

        targetMonth = 2;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfMarch += order.price * order.quantity;
            }
        });


        targetMonth = 3;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfApril += order.price * order.quantity;
            }
        });


        targetMonth = 4;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfMay += order.price * order.quantity;
            }
        });


        targetMonth = 5;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfJune += order.price * order.quantity;
            }
        });


        targetMonth = 6;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfJuly += order.price * order.quantity;
            }
        });

        targetMonth = 7;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfAugust += order.price * order.quantity;
            }
        });


        targetMonth = 8;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfSeptember += order.price * order.quantity;
            }
        });


        targetMonth = 9;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfOctober += order.price * order.quantity;
            }
        });


        targetMonth = 10;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfNovember += order.price * order.quantity;
            }
        });


        targetMonth = 11;
        orders.forEach((order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === targetMonth) {
                totalSumOfDecember += order.price * order.quantity;
            }
        });

        orders.forEach((order) => {
            totalOfAllSofar += order.price * order.quantity;

        });



        res.render('admin/statistics', {
            navbar, totalSumOfJanuary, totalSumOfFebruary,
            totalSumOfMarch, totalSumOfApril, totalSumOfMay,
            totalSumOfJune, totalSumOfJuly,
            totalSumOfAugust, totalSumOfSeptember, totalSumOfOctober, totalSumOfNovember, totalSumOfDecember,
            totalOfAllSofar
        });
    } catch (error) {
        console.error('error with orders:', error);
        res.status(500).render('error', { navbar });
    }
});




router.get('/statistics2', async (req, res, next) => {
    try {
        const contacts = await Contact.find();

        let totalSumOfContactJanuary = 0;
        let totalSumOfContactFebruary = 0;
        let totalSumOfContactMarch = 0;
        let totalSumOfContactApril = 0;
        let totalSumOfContactMay = 0;
        let totalSumOfContactJune = 0;
        let totalSumOfContactJuly = 0;
        let totalSumOfContactAugust = 0;
        let totalSumOfContactSeptember = 0;
        let totalSumOfContactOctober = 0;
        let totalSumOfContactNovember = 0;
        let totalSumOfContactDecember = 0;
        let totalOfAllContactSofar = 0;



        var targetMonth = 0;


        contacts.forEach((contact) => {
            totalOfAllContactSofar += 1;

        });


        targetMonth = 0;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactJanuary += 1;
            }
        });

        targetMonth = 1;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactFebruary += 1;
            }
        });

        targetMonth = 2;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactMarch += 1;
            }
        });

        targetMonth = 3;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactApril += 1;
            }
        });

        targetMonth = 4;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactMay += 1;
            }
        });

        targetMonth = 5;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactJune += 1;
            }
        });

        targetMonth = 6;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactJuly += 1;
            }
        });

        targetMonth = 7;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactAugust += 1;
            }
        });

        targetMonth = 8;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactSeptember += 1;
            }
        });

        targetMonth = 9;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactOctober += 1;
            }
        });

        targetMonth = 10;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactNovember += 1;
            }
        });


        targetMonth = 11;
        contacts.forEach((contact) => {
            const contactDate = new Date(contact.date);
            if (contactDate.getMonth() === targetMonth) {
                totalSumOfContactDecember += 1;
            }
        });


        res.render('admin/statistics2', {
            navbar, totalSumOfContactJanuary,
            totalSumOfContactFebruary, totalSumOfContactMarch, totalSumOfContactApril, totalSumOfContactMay,
            totalSumOfContactJune, totalSumOfContactJuly, totalSumOfContactAugust, totalSumOfContactSeptember,
            totalSumOfContactOctober, totalSumOfContactNovember, totalSumOfContactDecember,
            totalOfAllContactSofar
        });
    } catch (error) {
        console.error('error with orders:', error);
        res.status(500).render('error', { navbar });
    }
});


router.get("/facebook",async(req,res,next)=>{
    const message = req.cookies.message
    res.clearCookie('message')
    FB.api(
        '/122110394216001648/feed',
        'GET',
        function(r){
            res.render('admin/facebook',{navbar,r,message});
        }
    )
})

router.get("/facebook/delete",async(req,res,next)=>{
    FB.api(
        `/${req.query.id}`,
        'DELETE',
        function(r){
            res.cookie('message',`post deleted`)
            res.redirect('./');
        }
    )

})

router.get("/facebook/create",async(req,res,next)=>{
    res.cookie('message','post created')
    res.render("admin/facebookCreate",{navbar})
})

router.post("/facebook/create",async(req,res,next)=>{
    FB.api(
        '/122110394216001648/feed',
        'POST',
        {'message': req.body.message},
        function (r) { 
            res.redirect('/admin/facebook')
         }
    )
})

router.get("/facebook/update",async(req,res,next)=>{
    FB.api(
        `/${req.query.id}`,
        'GET',
        function(r){
            res.render('admin/facebookUpdate',{navbar,r});
        }
    )
})

router.post("/facebook/update",async(req,res,next)=>{
   
    FB.api(
        `/${req.query.id}`,
        'POST',
        {'message':req.body.message},
        function(r){
            console.log(r);
            res.cookie('message','post updated')
            res.redirect('/admin/facebook')
        }
    )
})

module.exports = router;