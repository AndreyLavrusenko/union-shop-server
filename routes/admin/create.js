const {verifyTokenAndAdmin} = require("./verifyAdmin");
const {createNewProduct} = require("../../controllers/admin/create");
const router = require('express').Router()


router.post('/create-product', verifyTokenAndAdmin, createNewProduct)

module.exports = router;