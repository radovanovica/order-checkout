const yup = require('yup');

const schema = yup.object().shape({
  id: yup.number().required(),
  cart: yup.object().shape({
    items: yup.array().of(
      yup.object().shape({
        productId: yup.string().required(),
        quantity: yup.number().integer().min(1).required(),
        price: yup.number().min(0).required()
      })
    ).required(),
    totalAmount: yup.number().min(0).required(),
    promoCodes: yup.array().of(yup.string())
  }).required(),  
  customer: yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    email: yup.string().email().required()
  }).required()
});

module.exports = schema;