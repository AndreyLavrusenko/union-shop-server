const createError = require("../error");
const {pool} = require("../db");

// Получение вырхней полоски в магазине
const getTopProduct = async (req, res, next) => {
    try {
        // Запрос на сервер
        const sql = `SELECT * FROM product WHERE isTop = ? AND isVisible = ?`;
        const data = [1, 1];

        pool.query(sql, data, (error, result) => {
            if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

            if (result.length === 0) {
                return res.status(400).json({message: "Products not found", resultCode: 1})
            }

            return res.status(200).json(result)
        })

    } catch (err) {
        next(createError(400, "Something went wrong!"))
    }
}

// Получение популярных товаров по категориям (3 полоски)
const popularFunc = (res, category, category_name, category_desc) => {
    // Запрос на сервер
    const sql = `SELECT ${category}, ${category_name}, ${category_desc} FROM system`;

    pool.query(sql, (error, result) => {
        if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

        const sql_select = `SELECT * FROM product WHERE categories = ?`
        // Дотсаю категорию
        const data = [([...Object.values(result[0])][0])]

        const titles = [([...Object.values(result[0])][1]), ([...Object.values(result[0])][2])]

        // Выбрать элементы из бд подходящие под категорию
        pool.query(sql_select, data, (error, resultProduct) => {
            if (error) return res.status(400).json({resultProduct: [], message: "Products not found", resultCode: 1})

            if (resultProduct.length > 0) {

                return res.json({resultProduct, titles}).status(200)
            } else {
                return res.json({resultProduct: [], resultCode: 1, message: "Products not found"}).status(400)
            }
        })
    })
}

const getPopularProductFirst = async (req, res, next) => {
    try {
        popularFunc(res, 'category_1', 'categories1_name', 'categories1_desc')
    } catch (err) {
        next(createError(404, "Nothing found"))
    }
}

const getPopularProductSecond = async (req, res, next) => {
    try {
        popularFunc(res, 'category_2', 'categories2_name', 'categories2_desc')
    } catch (err) {
        next(createError(404, "Nothing found"))
    }
}

const getPopularProductThird = async (req, res, next) => {
    try {
        popularFunc(res, 'category_3', 'categories3_name', 'categories3_desc')
    } catch (err) {
        next(createError(404, "Nothing found"))
    }
}

// Вывод картинки и текста рекламы
const getAdvertising = async = (req, res, next) => {
    try {
        const sql = `SELECT advertising_img, advertising_text FROM system`;

        pool.query(sql, (error, result) => {
            if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

            return res.status(200).json(...result)

        })
    } catch (err) {
        next(createError(404, "Advertising not found"))
    }
}


module.exports = {
    getTopProduct,
    getPopularProductFirst,
    getPopularProductSecond,
    getPopularProductThird,
    getAdvertising,
}