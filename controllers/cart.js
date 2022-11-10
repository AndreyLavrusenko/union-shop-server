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


            const sql = "INSERT INTO cart (userId, productId, productName, price, color, size, quantity) VALUES (?, ?, ?, ?, ?, ?, 1)"
            const data = [decoded.id, req.body.id, req.body.name, req.body.price, req.body.color, req.body.size]

            pool.query(sql, data, (error, result) => {
                if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                return res.status(201).json({resultCode: 0})
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

            pool.query(sql, data, (error, result) => {
                if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                return res.status(201).json({resultCode: 0, result})
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
}