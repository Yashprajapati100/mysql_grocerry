const { reject } = require('bluebird');
const User = require('../models/user');
var jwt = require('jsonwebtoken');
const secretKey = "secretKey";
const ResponseController = require('./ResponseController');
const validate = require('../middleware/validation');
class UserController {
  async update(req, res) {
    try {
      await validate.updatevalidation(req.body.firstname, req.body.lastname, req.body.email, mobilenumber);
      var token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey');
      var mobilenumber = decodedData.user[0].mobilenumber
      var userList = await User.update(req.body.firstname, req.body.lastname, req.body.email, mobilenumber);
      return ResponseController.success(userList, 'regirstration successfully', res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }

  async login(req, res) {
    try {
      await validate.loginvalidation(req.body.mobilenumber, req.body.otp);
      var user = await User.login(req.body.mobilenumber, req.body.otp)
      if (user == null) {
        return ResponseController.error(error, res);
      }
      if (user) {
        var token = jwt.sign({ user }, 'secretkey', { expiresIn: '100d' })
        user[0].auth_token = token;
        console.log("token=====>", token);
      }
      var data = db.query(`update users set auth_token= '${token}' where mobilenumber='${user[0].mobilenumber}'`)
      return ResponseController.success(user, 'user login success fully', res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async sendotp(req, res) {
    try {
      await validate.sendotpvalidation(req.body.mobilenumber);
      const ot = await User.sendotp(req.body);
      return ResponseController.success(ot, "otp success", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async resend(req, res) {
    try {
      await validate.resendotpvalidation(req.body.mobilenumber);
      const Details = await User.resend(req.body);
      return ResponseController.success(Details, "otp is not valid", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async category(req, res) {
    try {
      const detail = await User.category(req.query);
      return ResponseController.success(detail, "all category", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async product(req, res) {
    try {
      await validate.productvalidation(req.body.id);
      const store = await User.product(req.body.id);
      return ResponseController.success(store, "product detail", res);
    } catch (error) {
      return ResponseController.error(error, res)
    }
  }
  async search(req, res) {
    try {
      await validate.searchvalidation(req.body.search);
      const all = await User.search(req.body);
      return ResponseController.success(all, "search", res);
    } catch (error) {
      return ResponseController.error(error, res);

    }
  }
  async addwish_list(req, res) {
    try {
      await validate.addwish_listvalidation(req.body.product_id);
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var user = await User.addwish_list(req.body.product_id, user_id);
      return ResponseController.success(user, 'wishlist', res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }

  async getwish_list(req, res) {
    try {
      var token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey');
      var user_id = decodedData.user[0].user_id;
      let store = await User.getwish_list(user_id);
      return ResponseController.success(store, 'getwish_list', res);
    } catch (error) {
      return ResponseController.error(error, res);
    }

  }
  async brandlist(req, res) {
    try {
      const fil = await User.brandlist(req.body);
      return ResponseController.success(fil, "all brand", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async brandsearch(req, res) {
    try {
      await validate.brandserchvalidation(req.body.search);
      const sr = await User.brandsearch(req.body.search);
      return ResponseController.success(sr, "", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async discount(req, res) {
    try {
      const dis = await User.discount(req.body);
      return ResponseController.success(dis, "discount", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async sortby(req, res) {
    try {
      const sort = await User.sortby(req.body);
      return ResponseController.success(sort, "sort", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async price(req, res) {
    try {
      const mm = await User.price(req.body);
      return ResponseController.success(mm, "minmax value", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async add_cart(req, res) {
    try {
      await validate.add_cartvalidation(req.body.product_id, req.body.quantity);
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var user = await User.add_cart(user_id, req.body);
      return ResponseController.success(user, "product is add to basket", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async delete_cart(req, res) {
    try {
      await validate.delete_cartvalidation(req.body.product_id);
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var data = await User.delete_cart(req.body.product_id, user_id);
      return ResponseController.success(data, "product delete from basket", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }

  async cart_list(req, res) {
    try {
      // await validate.cart_listvalidation(req.body.product_id,req.body.quantity,req.body.coupan_id);
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var data = await User.cart_list(user_id, req.body);
      return ResponseController.success(data, 'cart list data', res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }

  async add_address(req, res) {
    try {
      await validate.add_addressvalidation(req.body.type, req.body.home_detail, req.body.landmark, req.body.recipient_name);
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var user = await User.add_address(req.body, user_id);
      return ResponseController.success(user, "address insert", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async delete_address(req, res) {
    try {
      await validate.delete_addressvalidation(req.body.address_id);
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var user = await User.delete_address(req.body, user_id);
      return ResponseController.success(user, "address delete", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async address_list(req, res) {
    try {
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var user = await User.address_list(user_id);
      return ResponseController.success(user, "address list", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async home_page(req, res) {
    try {
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var user = await User.home_page(user_id);

      return ResponseController.success(user, "home management", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async checkout(req, res) {
    try {
      // await validate.checkoutvalidation(req.body.payment_type);
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var user = await User.checkout(user_id, req.body);
      return ResponseController.success(user, "checkout", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async order_list(req, res) {
    try {
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var user = await User.order_list(user_id);
      return ResponseController.success(user, "order list", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async order_details(req, res) {
    try {
      await validate.order_detailsvalidation(req.body.order_id);
      let token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey')
      var user_id = decodedData.user[0].user_id;
      var user = await User.order_details(user_id,req.body);
      return ResponseController.success(user, "order detail", res);
    } catch (error) {
      return ResponseController.error(error, res);
    }
  }
  async sendmail(req, res) {
    try {
      let data = await UserService.sendmail(req);
      return ResponseController.success(data, 'delete brand', res);
    } catch (error) {
      console.log("=====>", error)
      return ResponseController.error(error,res);
    }
  }
  async add_review(req,res){
    try{
    let token = req.headers.authorization;
    var decodedData = jwt.verify(token,'secretkey')
    var user_id  = decodedData.user[0].user_id;
    var user = await User.add_review(user_id,req.body);
    return ResponseController.success(user,"review add successfully",res);
    }catch(error){
      return ResponseController.error(error,res);
    }
  }
}
module.exports = new UserController;