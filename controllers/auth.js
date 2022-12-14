const createError = require("../error");
const {pool, union_pool} = require("../db");
const md5 = require('md5-node');
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require('uuid');


// Взод через union id
const singInByUnionId = async (req, res, next) => {
    try {

        // Проверка были отправлены какие нибудь данные или нет
        if (!req.body.email || !req.body.password) return res.status(400).json({resultCode: 1})

        // Получение пользователя по введенным данным
        const sql = `SELECT id FROM registration WHERE email = ? AND password = ?`;
        const data = [req.body.email, md5(req.body.password)];


        // Отправка запроса и его проверка
        union_pool.query(sql, data, (error, result) => {
            if (error) return res.status(400).json({message: "Accounts not found", resultCode: 1})

            if (result.length === 0) {
                return res.status(400).json({message: "Accounts not found", resultCode: 1})
            }

            const token = jwt.sign({id: result[0].id}, process.env.SECRET_JWT, {expiresIn: '30d'})
            return res
                .cookie("access_token", token, {httpOnly: true})
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

// Регистрация или вход обычным способом
const signup = async (req, res, next) => {
    try {
        // Проверка были отправлены какие нибудь данные или нет
        if (!req.body.email || !req.body.password) return res.status(400).json({resultCode: 1})

        const hash = md5(req.body.password)

        const sql = `SELECT * FROM users WHERE email = ? AND password = ?`
        const data = [req.body.email, hash]


        // Отправка запроса и его проверка
        pool.query(sql, data, async (error, result) => {
            if (error) return res.status(400).json({message: error, resultCode: 1})

            // Если пользователя не сущетсвует то создаем его
            if (result.length === 0) {
                const id = uuidv4()

                const sql_reg = `INSERT INTO users (id, email, password) VALUES (?, ?, ?)`
                const regData = [id, req.body.email, hash]

                pool.query(sql_reg, regData, async (error, result) => {
                    if (error) return res.status(400).json({message: "Something went wrong!", resultCode: 1})

                    // Записываем email пользователя
                    const token = jwt.sign(
                        {email: req.body.email, id: id},
                        process.env.SECRET_JWT,
                        {expiresIn: '30d'}
                    )

                    return res
                        .cookie("access_token", token, {httpOnly: true})
                        .status(200)
                        .json({
                            resultCode: 0,
                            message: "Successfully Register",
                            token
                        })
                })
            } else {

                // Записываем email пользователя
                const token = jwt.sign(
                    {email: req.body.email, id: result[0].id},
                    process.env.SECRET_JWT,
                    {expiresIn: '30d'}
                )

                return res
                    .cookie("access_token", token, {httpOnly: true})
                    .status(200)
                    .json({
                        resultCode: 0,
                        message: "Successfully Login",
                        token
                    })

            }
        })


    } catch (err) {
        next(createError(400, "Something went wrong!"))
    }
}


const getUserInfo = async (req, res, next) => {
    try {

        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]

            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            const sql = "SELECT userInfo FROM users WHERE id = ?"
            const data = [decoded.id]

            pool.query(sql, data, (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json(result)
            })
        }

    } catch (err) {
        next(createError(400, "Something went wrong!"))
    }
}


const adminSingIn = async (req, res, next) => {
    try {
        // Проверка были отправлены какие нибудь данные или нет
        if (!req.body.email || !req.body.password) return res.status(400).json({resultCode: 1})

        const hash = md5(req.body.password)

        const sql = `SELECT * FROM users WHERE email = ? AND password = ?`
        const data = [req.body.email, hash]

        // Отправка запроса и его проверка
        pool.query(sql, data, async (error, result) => {
            if (error) return res.status(400).json({message: error, resultCode: 1})


            if (result.length === 0) {
                return res.status(200).json({resultCode: 1})
            } else {
                // Записываем email пользователя
                const token = jwt.sign(
                    {isAdmin: true, id: result[0].id},
                    process.env.SECRET_JWT,
                    {expiresIn: '30d'}
                )


                return res
                    .cookie("access_token", token, {httpOnly: true})
                    .status(200)
                    .json({
                        resultCode: 0,
                        message: "Successfully Login",
                        token
                    })
            }

        })

    } catch (err) {
        next(createError(400, "Something went wrong!"))
    }
}


const adminCheckAuth = (req, res, next) => {
    try {

        const authHeader = req.headers.token

        if (authHeader) {

            const token = authHeader.split(" ")[1]

            // Расшифровака токена
            const decoded = jwt.verify(token, process.env.SECRET_JWT)

            if (decoded.isAdmin) {
                return res.json({resultCode: 0})
            }

            return res.json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, "Something went wrong!"))
    }
}


module.exports = {
    singInByUnionId,
    signup,
    getUserInfo,
    adminSingIn,
    adminCheckAuth,
}