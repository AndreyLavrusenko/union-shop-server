const router = require('express').Router()
const {
    getTopProduct,
    getPopularProductFirst,
    getPopularProductSecond,
    getPopularProductThird,
    getAdvertising,
    getCategory,
    getAllProducts,
    getProductById,
} = require("../controllers/product");

// Получение главных (популярных) товаров
router.get('/top', getTopProduct)
// Получение популяргых товаров по категориям
router.get('/popular/first', getPopularProductFirst)
router.get('/popular/second', getPopularProductSecond)
router.get('/popular/third', getPopularProductThird)
router.get('/advertising', getAdvertising)
router.get('/category', getCategory)
router.get('/shop', getAllProducts)
router.get('/:id', getProductById)


module.exports = router;