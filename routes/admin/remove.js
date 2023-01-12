const {verifyTokenAndAdmin} = require("./verifyAdmin");
const {removeProduct, removeProductItem} = require("../../controllers/admin/remove");
const router = require('express').Router()


router.delete('/remove-product/:id', verifyTokenAndAdmin, removeProduct)
router.delete('/remove-product-item/:id', verifyTokenAndAdmin, removeProductItem)

module.exports = router;