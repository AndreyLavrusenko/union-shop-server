const {verifyTokenAndAdmin} = require("./verifyAdmin");
const {createNewProduct, createNewAllProduct, getNewAllProduct} = require("../../controllers/admin/create");
const router = require('express').Router()


router.post('/create-product', verifyTokenAndAdmin, createNewProduct)
router.post('/create-all-product/:id', verifyTokenAndAdmin, createNewAllProduct)
router.get('/get-all-product/:id', verifyTokenAndAdmin, getNewAllProduct)

module.exports = router;