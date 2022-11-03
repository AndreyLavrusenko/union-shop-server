const router = require('express').Router()
const {getTopProduct, getPopularProductFirst, getPopularProductSecond, getPopularProductThird, getAdvertising} = require("../controllers/product");

// Получение главных (популярных) товаров
router.get('/top', getTopProduct)
// Получение популяргых товаров по категориям
router.get('/popular/1', getPopularProductFirst)
router.get('/popular/2', getPopularProductSecond)
router.get('/popular/3', getPopularProductThird)
router.get('/advertising', getAdvertising)


module.exports = router;