const createError = require("../error");
const {pool} = require("../db");
const jwt = require("jsonwebtoken");


const setProduct = async (req, res, next) => {
    try {

        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]

            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            const sql_select = "SELECT * FROM cart WHERE userId = ?";
            const data_select = [decoded.id]
            // Получаю всю карзину и если такой товар уже есть обновляю его количество
            pool.query(sql_select, data_select, (error, result) => {


                const sql_search_in_cart = "SELECT * FROM cart WHERE productName = ? AND size = ? AND color = ?"
                const data_search_in_cart = [req.body.name, req.body.size, req.body.color]

                pool.query(sql_search_in_cart, data_search_in_cart, (error, result) => {
                    // Если такого товара еще нет в козине
                    if (result.length === 0) {
                        // Получаю id товара в таблице all_products
                        const sql_search = "SELECT id, uniqCode FROM all_products WHERE title_product = ? AND size = ? AND color = ?"
                        const data_search = [req.body.name, req.body.size, req.body.color]

                        // Добавляю товар в корзину с его уникальным id из другой таблицы
                        pool.query(sql_search, data_search, (error, result) => {
                            if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                            const product_all_id = result[0].id
                            const product_all_uniq = result[0].uniqCode


                            const sql = "INSERT INTO cart (userId, uniqCode, productId, allProductId, productName, price, color, size, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)"
                            const data = [decoded.id, product_all_uniq, req.body.id, product_all_id, req.body.name, req.body.price, req.body.color, req.body.size]

                            pool.query(sql, data, (error, result) => {
                                if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                                return res.status(201).json({resultCode: 0})
                            })
                        })
                    } else {
                        // Если в таблице есть такой товар, то увеличиваем счетчик на 1
                        const sql_update = "UPDATE cart SET quantity = quantity + 1 WHERE productName = ? AND size = ? AND color = ?"
                        const data_update = [req.body.name, req.body.size, req.body.color]

                        pool.query(sql_update, data_update, (error, result) => {
                            if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                            return res.status(201).json({resultCode: 0})
                        })
                    }
                })

            })

        } else {
            return res.status(500).json({resultCode: 1})
        }


    } catch (err) {
        next(createError(400, "Не удалось добавить товар в корзину"))
    }
}


const getAllCart = async (req, res, next) => {
    try {
        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]
            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            const sql = "SELECT * FROM cart WHERE userId = ?"
            const data = [decoded.id]

            function getItemCountFromAllProducts(arr, callback) {
                const resultArray = [];
                let pending = arr.length;
                const sql2 = "SELECT * FROM all_products WHERE id = ?"

                for (let i = 0; i < pending; i++) {
                    const data2 = [arr[i].allProductId];

                    pool.query(sql2, data2, (error, result) => {
                        if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                        resultArray.push(...result)
                        if (0 === --pending) {
                            callback(resultArray)
                        }
                    })
                }
            }

            pool.query(sql, data, (error, result) => {
                if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                if (result.length === 0) {
                    return res.json({resultCode: 1})
                } else {
                    getItemCountFromAllProducts(result, function (resultArray) {

                        result.forEach((result, i) => {
                            resultArray.forEach((item, j) => {
                                if (result.allProductId === item.id) {
                                    result.count = item.count
                                }
                            })
                        })

                        return res.status(200).json([...result])
                    })
                }
            })

        } else {
            return res.status(500).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}

// Получение информации их таблицы product по uniqCode для вывода товаров в карзине
const getItemCart = async (req, res, next) => {
    try {

        const sql = "SELECT * FROM product WHERE uniqCode = ?"
        const data = [req.params.uniqCode]

        pool.query(sql, data, (error, result) => {
            if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

            return res.status(200).json(...result)

        })

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}


const getAllCartQuantity = async (req, res, next) => {
    try {
        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]
            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            const sql = "SELECT quantity FROM cart WHERE userId = ?"
            const data = [decoded.id]

            pool.query(sql, data, (error, result) => {
                if (error) return res.status(400).json({message: "Products not found", resultCode: 1})


                const price = result.reduce((accumulator, object) => {
                    return accumulator + object.quantity
                }, 0)

                return res.status(201).json(price)

            })

        } else {
            return res.status(500).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}


const deleteCart = async (req, res, next) => {
    try {

        const sql = "DELETE FROM cart WHERE id = ?"
        const data = [req.params.id]

        pool.query(sql, data, (error, result) => {
            if (error) return res.status(400).json({message: "Товар не найден", resultCode: 1})

            return res.status(201).json({resultCode: 0})
        })


    } catch (err) {
        next(createError(400, 'Что-то пошло не так'))
    }
}


module.exports = {
    setProduct,
    getAllCart,
    deleteCart,
    getAllCartQuantity,
    getItemCart,
}