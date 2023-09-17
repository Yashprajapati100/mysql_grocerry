const { reject } = require('bluebird');
const Promise = require('bluebird');
const Joi = require("joi");

class validate {
  // update api validation
  async updatevalidation(email, firstname, lastname) {
    try {
      const joiSchema = Joi.object({
        email: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required()
          .messages({
            'string.email': `please enter correct email `,
          })
      });
      const validationResult = joiSchema.validate({ email, firstname, lastname }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error)
      }
    } catch (error) {
      return reject(error);
    }
  }

  // login api validation
  async loginvalidation(mobilenumber, otp) {
    try {
      const Schema = Joi.object({
        mobilenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
          'string.length': `phone number must be 10 digit`,
          'string.empty': `phone number is cannot be an empty field`,
        }),
        otp: Joi.required()
      });
      const validationResult = Schema.validate({ mobilenumber, otp }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }

  // send otp api validation
  async sendotpvalidation(mobilenumber) {
    try {
      const Schema = Joi.object({
        mobilenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
          'string.length': `phone number must be 10 digit`,
          'string.empty': `phone number is cannot be an empty field`,
        }),
      });
      const validationResult = Schema.validate({ mobilenumber }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }

  // resend otp api validation
  async resendotpvalidation(mobilenumber) {
    try {
      const Schema = Joi.object({
        mobilenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
          'string.length': `phone number must be 10 digit`,
          'string.empty': `phone number is cannot be an empty field`,
        }),
      });
      const validationResult = Schema.validate({ mobilenumber }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }

  // product list api validation
  async productvalidation(id) {
    try {
      const Schema = Joi.object({
        id: Joi.required()
      });
      const validationResult = Schema.validate({ id }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }
  async searchvalidation(search) {
    try {
      const Schema = Joi.object({
        search: Joi.string().required()
      });
      const validationResult = Schema.validate({ search }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }


  // add wish_list api validation
  async addwish_listvalidation(product_id) {
    try {
      const Schema = Joi.object({
        product_id: Joi.string().required()
      });
      const validationResult = Schema.validate({ product_id }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }

  //  brand search validation
  async brandserchvalidation(search) {
    try {
      const Schema = Joi.object({
        search: Joi.string().required()
      });
      const validationResult = Schema.validate({ search }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }

  // product  add  to cart api validation
  async add_cartvalidation(product_id,quantity) {
    try {
      const Schema = Joi.object({
        product_id: Joi.string().required(),
        quantity:Joi.string().required()
      });
      const validationResult = Schema.validate({ product_id,quantity }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }

  // product delete to cart api validation
  async delete_cartvalidation(product_id) {
    try {
      const Schema = Joi.object({
        product_id: Joi.string().required()
      });
      const validationResult = Schema.validate({ product_id }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }
  async cart_listvalidation(product_id,quantity,coupon_id) {
    try {
      const Schema = Joi.object({
        product_id: Joi.required(),
        quantity: Joi.string().required(),
        coupon_id: Joi.string().required()
      });
      const validationResult = Schema.validate({ product_id,quantity,coupon_id }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }

  async add_addressvalidation(type, home_detail, landmark, recipient_name) {
    try {
      const Schema = Joi.object({
        type: Joi.required(),
        home_detail: Joi.string().required(),
        landmark: Joi.string().required(),
        recipient_name: Joi.string().required()
      });
      const validationResult = Schema.validate({ type, home_detail, landmark, recipient_name }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }
  async delete_addressvalidation(address_id) {
    try {
      const Schema = Joi.object({
        address_id: Joi.required()
      });
      const validationResult = Schema.validate({ address_id }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }
  async checkoutvalidation(payment_type) {
    try {
      const Schema = Joi.object({
        payment_type: Joi.required()
      });
      const validationResult = Schema.validate({ payment_type }, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }
  async order_detailsvalidation(order_id) {
    try {
      const Schema = Joi.object({
        order_id: Joi.required(),
    
      });
      const validationResult = Schema.validate({ order_id}, { abortEarly: false });
      if (validationResult.error) {
        console.log(validationResult.error);
        return reject(validationResult.error);
        // return reject(validationResult.error)    
      }
    } catch (err) {
      return reject(err);
    }
  }

}

module.exports = new validate;
