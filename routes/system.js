const {getCopyright} = require("../controllers/system");
const router = require('express').Router()

// Получение копирайта
router.get('/copyright', getCopyright)


module.exports = router;