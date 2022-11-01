const createError = require("../error");
const pool = require("../db");
const md5 = require('md5-node');
const jwt = require("jsonwebtoken");

const singInByUnionId = async (req, res, next) => {
    try {

        // Проверка были отправлены какие нибудь данные или нет
        if (!req.body.email || !req.body.password) return res.status(400).json({resultCode: 1})

        // Получение пользователя по введенным данным
        const sql = `SELECT id FROM registration WHERE email = ? AND password = ?`;
        const data = [req.body.email, md5(req.body.password)];


        // Отправка запроса и его проверка
        pool.query(sql, data,(error, result) => {
            if (error) return res.status(400).json({message: "Accounts not found", resultCode: 1})

            if (result.length === 0) {
                return res.status(400).json({message: "Accounts not found", resultCode: 1})
            }

            const token = jwt.sign({id: result[0].id}, process.env.SECRET_JWT, {expiresIn: '30d'})
            return res
                .status(200)
                .json({
                    resultCode: 0,
                    message: "Successfully Login",
                    token
                })

        })
    } catch (err) {
        next(createError(404, "Something went wrong!"))
    }
}

module.exports = {
    singInByUnionId,
}