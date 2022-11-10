const {setProduct, getAllCart, deleteCart} = require("../controllers/cart");
const router = require('express').Router()


router.post('/', setProduct)
router.get('/all', getAllCart)
router.delete('/:id', deleteCart)


module.exports = router;