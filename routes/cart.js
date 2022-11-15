const {setProduct, getAllCart, deleteCart, getAllCartQuantity, getItemCart} = require("../controllers/cart");
const router = require('express').Router()


router.post('/', setProduct)
router.get('/all', getAllCart)
router.get('/item/:uniqCode', getItemCart)
router.get('/quantity', getAllCartQuantity)
router.delete('/:id', deleteCart)


module.exports = router;