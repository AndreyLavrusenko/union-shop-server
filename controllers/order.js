const createError = require("../error");
const {pool} = require("../db");
const jwt = require("jsonwebtoken");


const createOrder = (req, res, next) => {
    try {

        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]

            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            const sql_select = "SELECT allProductId, productName, color, price, size, quantity FROM cart WHERE userId = ?";
            const data_select = [decoded.id]

            // Получение товаров из корзины
            pool.query(sql_select, data_select, (error, resultCart) => {
                if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                const sql_order = "SELECT status, id FROM orders WHERE userId = ?";
                const data_order = [decoded.id]

                // Получение всех заказов пользователя
                pool.query(sql_order, data_order, (error, result) => {
                    if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                    let orderProcessId = null


                    // Просматриваем все заказы пользователи и ищем тот, который еще не готов
                    result.map(item => {
                        if (item.status === 'process') {
                            orderProcessId = item.id
                        }
                    })


                    const total = resultCart.reduce((acc, obj) => {
                        return acc + obj.price * obj.quantity;
                    }, 0)


                    // Если заказ уже есть, но еще не оплачен, то обновлеям его
                    if (orderProcessId) {
                        const sql_create = "UPDATE orders SET deliveryType = ?, deliveryPrice = ?, myOrder = ?, total = ?, letter = ?, status = ? WHERE id = ? AND status = ?"
                        const data_create = [req.body.deliverType, 0, JSON.stringify(resultCart), total, req.body.letter, 'process', orderProcessId, 'process']

                        pool.query(sql_create, data_create, (error, result) => {
                            if (error) return res.status(400).json({message: error, resultCode: 1})

                            return res.status(201).json(result)
                        })


                        //Если заказ уже был оплачен и его статус изменился, то создаем новый заказ
                    } else {
                        const sql_create = "INSERT INTO orders (userId, deliveryType, myOrder, total, status, letter) VALUES (?, ?, ?, ?, ?, ?)"
                        const data_create = [decoded.id, req.body.deliverType, JSON.stringify(resultCart), total, 'process', req.body.letter]


                        pool.query(sql_create, data_create, (error, result) => {
                            if (error) return res.status(400).json({message: error, resultCode: 1})

                            return res.status(201).json(result)
                        })
                    }
                })

            })
        }

    } catch (err) {
        next(createError(400, "Не удалось собрать заказ"))
    }
}


const getOrderSum = async (req, res, next) => {
    try {

        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]

            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            const sql = "SELECT total, deliveryPrice FROM orders WHERE userId = ? AND status = ?";
            const data = [decoded.id, 'process']

            pool.query(sql, data, (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json(result)
                    // .json(result[0].total + result[0].deliveryPrice)
            })

        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}


const setNewDeliveryPrice = async (req, res, next) => {
    try {

        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]

            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            const sql = "UPDATE orders SET deliveryPrice = ?, deliverTypeDetails = ? WHERE userId = ? AND status = ?"
            const data = [req.body.price, req.body.deliveryType, decoded.id, 'process']

            pool.query(sql, data, (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json({resultCode: 0})
            })

        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}


const deleteCostOfDelivery = async (req, res, next) => {
    try {
        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]

            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            const sql = "UPDATE orders SET deliveryPrice = 0 WHERE userId = ? AND status = ?"
            const data = [decoded.id, 'process']

            pool.query(sql, data, (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json({resultCode: 0})
            })
        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}

// Пользователь заполнил форму с личными данными и нажал продолжить
const setDeliveryUserInfo = async (req, res, next) => {
    try {

        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]

            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            const sql = "UPDATE orders SET userInfo = ?, email = ? WHERE userId = ? AND status = ?"
            const data = [req.body.userInfo, req.body.email, decoded.id, 'process']

            pool.query(sql, data, (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json({resultCode: 0})
            })
        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}

// Нажатие на кнопку оплатить
const makeOrder = (req, res, next) => {
    try {

        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]

            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            const sql = "UPDATE orders SET status = ? WHERE userId = ? AND status = ?"
            const data = ['performed', decoded.id, 'process']

            pool.query(sql, data, (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                const cart_sql = "DELETE FROM cart WHERE userId = ?"
                const cart_data = [decoded.id]

                pool.query(cart_sql, cart_data, (error) => {
                    if (error) return res.status(400).json({message: error, resultCode: 1})

                    return res.status(200).json({resultCode: 0})
                })
            })
        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}


module.exports = {
    createOrder,
    getOrderSum,
    setNewDeliveryPrice,
    deleteCostOfDelivery,
    setDeliveryUserInfo,
    makeOrder,
}