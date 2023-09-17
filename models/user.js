const { resolve, reject } = require("bluebird");
var moment = require('moment');
const { error } = require("../controller/ResponseController");
const promise = require('bluebird');
const { usercontroller } = require("../controller/usercontroller");


class User {

  // update user profile
  async update(firstname, lastname, email, mobilenumber) {
    return new Promise(async (resolve, reject) => {
      try {
        var [emailcheck] = await db.query(`SELECT * FROM users where email='${email}'`);
        for (let i = 0; i < emailcheck.length; i++) {
          if (emailcheck[i].email == email && emailcheck[i].mobilenumber == mobilenumber) {
            var [data] = await db.query(`UPDATE users set firstname = '${firstname}', lastname= '${lastname}',email ='${email}',is_register="1" where mobilenumber='${mobilenumber}'`);
            if (data) {
              resolve("profile is updated");
              var [uquery] = await db.query(`SELECT * FROM users where mobilenumber='${mobilenumber}' and is_register="1"`);
            }
          }
          else {
            var error = Error("email already exits");
            reject(error);
          }
        }
        if (!emailcheck.length > 0) {
          var [update] = await db.query(`UPDATE users set firstname = '${firstname}', lastname= '${lastname}',email ='${email}',is_register="1" where mobilenumber='${mobilenumber}'`);
          if (update) {
            resolve("profile is updated");
            var [uquery] = await db.query(`SELECT * FROM users where mobilenumber='${mobilenumber}' and is_register="1"`);
          } else {
            var error = Error("not updated your data");
            reject(error);
          }
        }
      } catch (error) {
        var err = { message: error.message }
        return reject(err)
      }
    })
  }

  //mobilenumber and otp verify and token genrate
  async login(mobilenumber, otp) {
    try {
      return new Promise(async (resolve, reject) => {
        var [sel] = await db.query(`SELECT user_id,firstname,lastname,email,mobilenumber FROM users where mobilenumber='${mobilenumber}'`)
        if (sel.length > 0) {
          var [ot] = await db.query(`select user_id,firstname,lastname,email,mobilenumber from users where mobilenumber='${mobilenumber}' and otp='${otp}'`)
          console.log(ot);
          if (ot.length > 0) {
            return resolve(sel)
          } else {
            var err = Error("otp is not valid")
            reject(err)
          }
        }
        else {
          var err2 = Error("enter valid phone number")
          reject(err2)
        }
      })
    } catch (error) {
      reject(error);
    }
  }

  // user send otp
  async sendotp(mobilenumber) {
    try {
      return new Promise(async (resolve, reject) => {
        var [ot] = await db.query(`SELECT * FROM users WHERE mobilenumber='${mobilenumber}'`)
        if (ot.length < 0) {
          var val = Math.floor(1000 + Math.random() * 9000);
          console.log(val);
          resolve(val)
          var [H] = await db.query(`UPDATE users set otp = '${val}' WHERE mobilenumber ='${mobilenumber}';`)
        } else {
          var [ins] = await db.query(`INSERT INTO users(mobilenumber) VALUES ('${mobilenumber}');`)
          if (ins) {
            var val = Math.floor(1000 + Math.random() * 9000);
            db.query(`UPDATE users set  is_register = '1',otp = '${val}' WHERE mobilenumber ='${mobilenumber}';`)
            console.log(val);
            resolve(val)
          }
        }
      })
    } catch (error) {
      reject(error);
    }
  }

  //resend otp 
  async resend(mobilenumber) {
    return new Promise(async (resolve, reject) => {
      var [E] = await db.query(`SELECT * FROM users where mobilenumber='${mobilenumber}' and is_register="1"`)
      if (E.length > 0) {
        var val = Math.floor(1000 + Math.random() * 9000);
        console.log(val);
        db.query(`UPDATE users set otp = '${val}' WHERE mobilenumber ='${mobilenumber}';`)
        return resolve()
      } else {
        return reject();
      }
    })
  }

  //category to subcategory data fetch
  async category(body) {
    try {
      return new Promise(async (resolve, reject) => {
        let [category, field] = await db.query(`SELECT * FROM category `);
        for (let x = 0; x < category.length; x++) {
          const [subcategory, fields] = await db.query(`select * from subcategory where category_id='${category[x].category_id}'`);
          category[x].list = subcategory;
        }
        resolve(category);
      })
    } catch (err) {
      return reject(err)
    }
  }

  // product to subcategory data fetch
  async product(id) {
    try {
      return new Promise(async (resolve, reject) => {
        let [subcategory, field] = await db.query(`SELECT * FROM subcategory where subcategory_id='${id}'`);
        if (subcategory.length > 0) {
          const [product, fields] = await db.query(`SELECT * FROM product where subcategory_id='${subcategory[0].subcategory_id}'`);
          subcategory[0].productlist = product
          resolve(subcategory);
        } else {
          var data = {
            message: "id is not available in database "
          }
          reject(data);
        }
      })
    } catch (err) {
      return reject(err)
    }
  }

  //search product and filter search
  async search(body) {
    try {
      let { search, filter } = body;
      let whereCondition = `WHERE 1 = 1`;
      let orderBy = ` p.current_date DESC`;
      if ('search' in body) {
        search = search.trim();
        whereCondition = whereCondition + ` AND p.productname like '%${search}%'`;
      }
      if ('filter' in body) {
        let filterCondition = await this.filterBy(filter, whereCondition);
        whereCondition = filterCondition.whereCondition;
        orderBy = filterCondition.orderBy;
      }
      let searchquery = `SELECT p.product_id,p.brand_id,p.productname,p.price, p.image,p.discount_price, p.variation, b.brandname, CASE WHEN w.wish_id IS NULL THEN 0 ELSE 1 END as is_like
      FROM product p
      LEFT OUTER JOIN brand as b on p.brand_id = b.brand_id
      LEFT OUTER JOIN wish_list as w on w.product_id = p.product_id
      ${whereCondition} ORDER BY ${orderBy};`;

      const [products, fields] = await db.query(searchquery);
      return products;
    } catch (error) {
      error.code = 501;
      return promise.reject(error)
      console.log(error);
    }
  }
  async filterBy(filter, whereCondition) {
    let orderBy = ` p.current_date DESC`;
    if ('brand' in filter) {
      let brandIds = filter.brand.toString();
      whereCondition = whereCondition + ` AND p.brand_id in (${brandIds})`;
    }
    if ('price' in filter && filter.price) {
      let minPrice = filter.price.min;
      let maxPrice = filter.price.max;
      whereCondition = whereCondition + ` AND p.price >= (${minPrice}) AND p.price < (${maxPrice})`;
    }
    if ('discount' in filter && filter.discount != null && filter.discount != '') {
      let minDiscount, maxDiscount;
      switch (filter.discount) {
        case 1:
          minDiscount = 0;
          maxDiscount = 5;
          break;
        case 2:
          minDiscount = 5;
          maxDiscount = 10;
          break;
        case 3:
          minDiscount = 10;
          maxDiscount = 15;
          break;
        case 4:
          minDiscount = 15;
          maxDiscount = 20;
          break;
        case 5:
          minDiscount = 25;
          maxDiscount = 100;
          break;
      }
      whereCondition = whereCondition + ` AND p.discount_price >= (${minDiscount}) AND p.discount_price < (${maxDiscount})`;
    }
    if ('sortby' in filter) {
      switch (filter.sortby) {
        case 1:
          orderBy = ` p.price ASC`;
          break;
        case 2:
          orderBy = ` p.price DESC`;
          break;
      }
    }
    return { whereCondition: whereCondition, orderBy: orderBy }
  }

  // product is add wishlist
  async addwish_list(product_id, user_id) {
    try {
      return new Promise(async (resolve, reject) => {
        var [sel] = await db.query(`select * from product where product_id='${product_id}'`);
        if (sel.length > 0) {
          var [check] = await db.query(`select * from wish_list where user_id='${user_id}' and product_id='${product_id}'`);
          if (check.length > 0) {
            var [del] = await db.query(`delete from wish_list where user_id='${user_id}' and product_id='${product_id}'`);
            var del = { message: "product removed from wish_list" }
            resolve(del)
            if (del) {
              var [flag1] = await db.query(`update product set flag='0' where product_id='${product_id}'`);
            }
          }
          else {
            var [insert] = await db.query(`INSERT INTO wish_list (user_id,product_id) values ('${user_id}','${product_id}')`)
            var insertdata = { message: "product added to wish_list successfully" }
            resolve(insertdata)
            if (insert) {
              var [flag] = await db.query(`update product set flag='1' where product_id='${product_id}'`);
            }
          }
        }
        else {
          var err = { message: "product id not found please enter valid product id" }
          reject(err)
        }
      })
    } catch (error) {
      return reject(error);
    }
  }

  // user is wish list  detail
  async getwish_list(user_id) {
    try {
      return new Promise(async (resolve, reject) => {
        var [jo] = await db.query(`SELECT * FROM wish_list JOIN product ON product.product_id = wish_list.product_id where wish_list.user_id='${user_id}';`)
        return resolve(jo);
      });
    } catch (error) {
      reject(error);
    }
  }

  //brand list
  async brandlist(body) {
    return new Promise(async (resolve, reject) => {
      var [T] = await db.query(`SELECT * FROM brand`);
      resolve(T);
    })
  }

  //brand search
  async brandsearch(search) {
    try {
      var l = []
      return new Promise(async (resolve, reject) => {
        var [brand, field] = await db.query(`SELECT * FROM brand`)
        var serching = `${search}`.trim();
        for (let x = 0; x < brand.length; x++) {
          for (let i = 0; i < brand[x].brandname.length; i++) {
            let j = 0
            if (serching[j] == brand[x].brandname[i]) {
              j++
              l.push(brand[x])
            }
            resolve(l);
          }
        }
      })
    } catch (error) {
      reject(error);
    }
  }

  //discount price
  async discount(body) {
    return new Promise(async (resolve, reject) => {
      var dis = {
        1: "upto 5%",
        2: "5%-10%",
        3: "10%-15%",
        4: "15%-20%",
        5: "more than 25%"
      }
      resolve(dis);
    })
  }

  //sortby product
  async sortby(body) {
    return new Promise(async (resolve, reject) => {
      var sort = {
        1: "popularity",
        2: "price -low to high",
        3: "price -high to low",
        4: "Alphabetical",
        5: "Rupee saving - high to low",
        6: "Rupee saving - low to high",
        7: "%off-high to low"
      }
      resolve(sort);
    })
  }

  //price range
  async price() {
    return new Promise(async (resolve, reject) => {
      var [mm] = await db.query(`SELECT min(price) as minprice,max(price) as maxprice FROM product`);
      resolve(mm);
    })
  }

  // product add to  cart
  async add_cart(user_id, body) {
    try {
      return new promise(async (resolve, reject) => {
        let { product_id, quantity } = body
        var [check] = await db.query(`SELECT * from add_cart WHERE product_id='${product_id}'and user_id ='${user_id}'`)
        if (check.length > 0) {
          if (quantity > 0) {
            var [updatequantity] = await db.query(`update add_cart set quantity='${quantity}'where product_id='${product_id}'and user_id='${user_id}'`);
            resolve("quantity is updateed")
          } else {
            resolve("quantity is grater then zero")
          }
        } else {
          var [sel] = await db.query(`select * from product where product_id='${product_id}'`)
          if (sel.length > 0) {
            if (sel[0].stock == "1") {
              var [ins] = await db.query(`insert into add_cart(product_id,user_id,quantity) values('${product_id}','${user_id}','${quantity}')`);
              resolve("quantity is added")
            } else {
              resolve("stock is not availabel")
            }
          } else {
            resolve("product not found"[0]);
          }
        }
      })
    } catch (error) {
      reject(error);
    }
  }

  //delete product from cart
  async delete_cart(product_id, user_id) {
    try {
      return new promise(async (resolve, reject) => {
        var [select] = await db.query(`SELECT * FROM add_cart WHERE product_id = '${product_id}'`);
        if (select.length > 0) {
          var [del] = await db.query(`DELETE FROM add_cart WHERE user_id='${user_id}'AND product_id='${product_id}'`)
          resolve(del[0]);
        }
      })
    } catch (error) {
      reject(error);
    }
  }

  async cart_list(user_id, body) {
    return new Promise(async (resolve, reject) => {
      try {

        let { quantity, product_id } = body

        var [delet] = await db.query(`Delete add_cart from add_cart  LEFT JOIN product ON add_cart.product_id=product.product_id where product.stock = '0' `)

        var [update] = await db.query(`update add_cart set quantity= '${quantity}' where user_id='${user_id}' and product_id='${product_id}'`)

        console.log("========>", update)

        var [deletepr] = await db.query(`delete from add_cart where quantity="0" `)

        var [fetch] = await db.query(`select product.product_id,product.image,product.productname,product.price,add_cart.quantity from product inner join add_cart on product.product_id=add_cart.product_id where add_cart.user_id='${user_id}'`);

        let cart = await this.cart(user_id, body)

        resolve(fetch.concat(cart))

      } catch (error) {
        return reject(error)
      }
    })
  }

  async cart(user_id, body) {

    let { coupan_id } = body
    var discountsum = 0;
    var cartdiscount = [];

    let [total] = await db.query(`SELECT SUM(price*quantity) as price FROM product  JOIN add_cart ON product.product_id=add_cart.product_id WHERE add_cart.user_id='${user_id}';`)
    var totaldata = total[0].price

    var [join] = await db.query(`SELECT product.productname,product.image,product.price,product.variation from add_cart JOIN product ON product.product_id = add_cart.product_id WHERE add_cart.user_id='${user_id}'; `)

    let [select] = await db.query(`select * from product Join add_cart on product.product_id=add_cart.product_id where add_cart.user_id='${user_id};'`)
    for (let i = 0; i < select.length; i++) {
      select[i].price = select[i].price * select[i].quantity
      select[i].discount = select[i].discount * select[i].quantity
      select[i].discount_price = select[i].discount_price * select[i].quantity
      console.log("quantity==>", select[i].price)

      var discount = select[i].price * select[i].discount / 100
      console.log("discount rate price", discount)
      if (discount < select[i].discount_price) {
        var discountdata = select[i].price - discount

      } else {
        var discountdata = select[i].price - select[i].discount_price

      }
      cartdiscount.push(discountdata)
    }
    for (let j = 0; j < cartdiscount.length; j++) {
      discountsum = discountsum + cartdiscount[j];
    }
    console.log("discountsum", discountsum);


    let [tax] = await db.query(`SELECT tax FROM setting`)
    var taxdata = tax[0].tax
    tax = totaldata * taxdata / 100
    // var final = totaldata + tax

    let [charge] = await db.query(`select free_delivery_upto as free from setting;`)
    var ch = charge[0].free

    if (totaldata > ch) {
      var result = "free"
    } else {
      var [del] = await db.query(`select delivery_charge as d from setting;`)
      var result2 = del[0].d
    }
    if (result) {
      var data = totaldata + tax
    } else {
      var overalltotal = totaldata + result2 + tax
    }
    var [coupan] = await db.query(`select * from coupan_management where coupan_id='${coupan_id}'`)
    if (coupan.length > 0) {

      var d = new Date()
      var currentdate = moment(d)
      var enddate = moment(coupan[0].enddate)
      if (currentdate.isSameOrBefore(enddate)) {
        if (totaldata > coupan[0].min_price) {
          // f = final - coupan[0].discount_price
          // // console.log("==>",final)
          // overalltotal = overalltotal - coupan[0].discount_price
          discountsum = discountsum + coupan[0].discount_price
        } else {
          resolve(`total is grater than '${coupan[0].min_price}' than coupon is used`);
        }
      } else {
        resolve('coupan is exprise');
      }
    }
    let basket = {
      total: totaldata,
      discount_price: discountsum,
      TAX: tax,
      deliverycharge: result || result2,
      grandtotal: data || overalltotal,
      totalsaving: discountsum
    }
    return basket;
  }

  // user add address
  async add_address(body, user_id) {
    try {
      let { type, home_detail, landmark, recipient_name } = body
      let date = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      return new promise(async (resolve, reject) => {
        var [check] = await db.query(`select * from address where user_id='${user_id}' and type='${type}'`);
        if (!check.length > 0) {
          let [select] = await db.query(`insert into address (type,home_detail,landmark,recipient_name,user_id,created_date,update_date) VALUES ('${type}','${home_detail}','${landmark}','${recipient_name}','${user_id}','${date}','${date}')`);
          return resolve(select[0]);
        } else {
          var err = { message: "user is all ready address insert" }
          return reject(err);
        }
      })
    } catch (error) {
      reject(error);
    }
  }

  // user delete address
  async delete_address(body, user_id) {
    try {
      return new promise(async (resolve, reject) => {
        let { address_id } = body
        var [check] = await db.query(`select * from address where user_id='${user_id}' and address_id='${address_id}'`);
        if (check.length > 0) {
          var [del] = await db.query(`delete  from address where user_id='${user_id}'and address_id='${address_id}'`);
          return resolve(del[0]);
        } else {
          var err = { message: "address_id is not available " }
          return reject(err);
        }
      })
    } catch (error) {
      reject(error);
    }
  }

  //user adress list
  async address_list(user_id) {
    try {
      return new promise(async (resolve, reject) => {
        var [list] = await db.query(`select * from address where user_id='${user_id}'`);
        resolve(list);
      })
    } catch (error) {
      reject(error);
    }
  }

  // home page section type
  async home_page(id) {
    try {
      return new promise(async (resolve, reject) => {
        var [select, field] = await db.query(`select * from section `);
        for (let i = 0; i < select.length; i++) {
          var [sel, fields] = await db.query(`select * from slider join category on slider.category_id =category.category_id where  slider.section_id='${select[i].section_id}'`);
          if (sel.length > 0) {
            select[i].list = sel
          } else {
            select[i].list = [];
          }
          var [section_category] = await db.query(`select * from section_category join category on section_category.category_id =category.category_id where  section_category.section_id='${select[i].section_id}'`);
          if (section_category.length > 0) {
            select[i].list = section_category
          }
          var [section_brand] = await db.query(`select * from section_brand join brand on section_brand.brand_id =brand.brand_id where section_brand.section_id='${select[i].section_id}'`);
          if (section_brand.length > 0) {
            select[i].list = section_brand
          }
          var [section_product] = await db.query(`select * from section_product join product on section_product.product_id =product.product_id where section_product.section_id='${select[i].section_id}'`);
          if (section_product.length > 0) {
            select[i].list = section_product
          }// resolve(call);
        }
        resolve(select)
      })
    } catch (error) {
      return reject(error);
    }
  }

  async checkout(user_id, body) {
    return new Promise(async (resolve, reject) => {
      try {

        var [check] = await db.query(`select * from add_cart where user_id='${user_id}'`)
        let { address_id, coupan_id } = body

        var [address] = await db.query(`select address_id from address where user_id='${user_id}' and address_id='${address_id}'`)

        var cod = "COD"
        var data = await this.cart(user_id, body)
        var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

        if (check.length > 0) {

          var [insert] = await db.query(`insert into orders(date,user_id,sub_total,deliverycharge,grandtotal,payment_type,address_id,status,coupan_id) values ('${date}','${user_id}','${data.total}','${data.deliverycharge}','${data.grandtotal}','${cod}','${address[0].address_id}','${1}','${coupan_id}')`)

          if (insert) {
            var [select] = await db.query(`select * from product inner join add_cart on product.product_id=add_cart.product_id  join orders on add_cart.user_id=orders.user_id where orders.user_id='${user_id}' and add_cart.user_id='${user_id}'`)

            for (let i = 0; i < select.length; i++) {
              var orderitem = await db.query(`insert into order_item(product_id,order_id,price,discount_price,quantity)values('${select[i].product_id}','${select[i].order_id}','${select[i].price}','${select[i].discount_price}','${select[i].quantity}')`)
            }
          }

        }
        var cartlist = {
          item_total: data,
          delieverytype: cod
        }
        resolve(cartlist)
      } catch (error) {
        return reject(error)
      }
    })
  }
  async order_list(user_id) {
    try {
      return new promise(async (resolve, reject) => {
        var [data] = await db.query(`select orders.date ,orders.order_id,orders.status,orders.grandtotal as Totalpayment,address.type as Deliveredto from orders inner join address on address.address_id=orders.address_id where orders.user_id='${user_id}'`)
        resolve(data)

        return resolve(data);
      })
    } catch (error) {
      return reject(error);
    }
  }

  async order_details(user_id, body) {
    try {
      return new promise(async (resolve, reject) => {

        let { order_id } = body

        var [join] = await db.query(`select o.order_id ,o.payment_type as paymenttype ,o.date ,a.home_detail,a.landmark from orders as o inner join address as a on o.address_id=a.address_id 
        where o.user_id='${user_id}' and o.order_id='${order_id}'`);

        if (join.length > 0) {

          var [product] = await db.query(`select p.image,p.productname,p.price,o.quantity from order_item as o inner join product as p on o.product_id=p.product_id where o.order_id='${order_id}'`);

          join[0].item = product

          var [totaldata] = await db.query(`select sub_total,deliverycharge,grandtotal from orders where order_id='${order_id}'`)

          join[0].Billdetails = totaldata[0]
          resolve(join);
        } else {
          var data = {
            message: "order is not available"
          }
          reject(data);
        }
      })
    } catch (error) {
      return reject(error);
    }
  }
  async sendmail(req, res) {
    try {
      return new promise(async (resolve, reject) => {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: 'tristate.mteam@gmail.com',
            pass: 'nuwuxqxjnogjuwyb'
          }
        });
        var mailOptions = await transporter.sendMail({
          from: 'tristate.mteam@gmail.com',
          to: 'yashpra14@gmail.com',
          subject: 'hello ys',
          text: 'tristate123'
        });
        console.log("======>", mailOptions)
        return resolve(mailOptions);
      })
    } catch (error) {
      return reject(error);
    }
  }

  async add_review(user_id, body) {
    try {
      let { product_id, review_star } = body;
      return new promise(async (resolve, reject) => {
        var [check] = await db.query(`select * from product where product_id='${product_id}'`);
        for (let i = 0; i < check.length; i++) {
          var [insert] = await db.query(`insert into review(user_id,product_id,review_star) values('${user_id}','${product_id}','${review_star}')`);
        }
        if (check.length) {
          return resolve(insert[0]);
        }
        else {
          var data = {
            message: "product_id not available"
          }
          return reject(data);
        }
      })
    } catch (error) {
      return reject(error);
    }
  }
}
module.exports = new User;   