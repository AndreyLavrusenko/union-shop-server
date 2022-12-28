const {setProduct, getAllCart, deleteCart, getAllCartQuantity, getItemCart, updateCartQuantityPlus, updateCartQuantityMinus} = require("../controllers/cart");
const router = require('express').Router()


router.post('/', setProduct)
router.get('/all', getAllCart)
router.get('/item/:uniqCode', getItemCart)
router.get('/quantity', getAllCartQuantity)
router.delete('/:id', deleteCart)
router.put('/plus-quantity/:id', updateCartQuantityPlus)
router.put('/minus-quantity/:id', updateCartQuantityMinus)


module.exports = router;