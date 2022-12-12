const {createOrder, getOrderSum, setNewDeliveryPrice, deleteCostOfDelivery} = require("../controllers/order");
const router = require('express').Router()


router.post('/delivery-method', createOrder)
router.post('/change-price', setNewDeliveryPrice)
router.get('/order-sum', getOrderSum)
router.put('/delete-delivery-method', deleteCostOfDelivery)

module.exports = router;