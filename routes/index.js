const express = require('express');
const router = express.Router();
const UserController = require('../controller/usercontroller')
const authMiddleware = require('../middleware/auth');

/* user login api */
router.post('/login', UserController.login);

/* user update profile api */
router.post('/update', authMiddleware.authenticate, UserController.update);

/* user otp send and new mobileno.insert api */
router.post('/sendotp', UserController.sendotp);

/* user resend otp api */
router.post('/resend', UserController.resend);

/* category data fetch api */
router.post('/category', UserController.category);

/* product list api */
router.post('/subcategory-product-list', UserController.product);

/* product search  api */
router.post('/product-search', UserController.search);

/* product wishlist api */
router.post('/addwish_list', authMiddleware.authenticate, UserController.addwish_list);

/* user_id to product wishlist api */
router.post('/getwish_list', authMiddleware.authenticate, UserController.getwish_list);

/* brand list api */
router.post('/brand-list', UserController.brandlist);

/* brand search api */
router.post('/brandsearch', UserController.brandsearch);

/* discount price api */
router.post('/discount', UserController.discount);

/* brand sortby api */
router.post('/sortby', UserController.sortby);

/* price min max api */
router.post('/price', UserController.price);

/* product add to cart api */
router.post('/add_cart', authMiddleware.authenticate, UserController.add_cart);

/* product delete to cart api */
router.post('/delete_cart', authMiddleware.authenticate, UserController.delete_cart);

/*cart list api */
router.post('/cart_list', authMiddleware.authenticate, UserController.cart_list);

/*add address api */
router.post('/add_address', authMiddleware.authenticate, UserController.add_address);

/*delete address api */
router.post('/delete_address', authMiddleware.authenticate, UserController.delete_address);

/*address list api */
router.post('/address_list', authMiddleware.authenticate, UserController.address_list);

/*home page section api */
router.post('/home_page_section', authMiddleware.authenticate, UserController.home_page)

/*checkout  api */
router.post('/checkout', authMiddleware.authenticate, UserController.checkout);

router.post('/order_list', authMiddleware.authenticate, UserController.order_list);

router.post('/order_details', authMiddleware.authenticate, UserController.order_details);

router.post('/send-mail', UserController.sendmail);

router.post('/add-review', authMiddleware.authenticate,UserController.add_review);

module.exports = router;     