const {createOrder, getOrderSum, setNewDeliveryPrice, deleteCostOfDelivery, getOrderById, getQuantityOrders, setDeliveryUserInfo, makeOrder, getOrders} = require("../controllers/order");
const router = require('express').Router()


router.post('/delivery-method', createOrder)
router.post('/change-price', setNewDeliveryPrice)
router.get('/order-sum', getOrderSum)
router.put('/delete-delivery-method', deleteCostOfDelivery)
router.put('/delivery-user-info', setDeliveryUserInfo)
router.put('/delivery-buy', makeOrder)
router.get('/get-quantity-orders', getQuantityOrders)
router.get('/get-orders', getOrders)
router.get('/get-order/:id', getOrderById)

module.exports = router;