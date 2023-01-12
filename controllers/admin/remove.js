const createError = require("../../error");
const {pool} = require("../../db");


const removeProduct = (req, res, next) => {
    try {
        const sql = "DELETE FROM product WHERE uniqCode = ?"
        const data = [req.params.id]

        pool.query(sql, data, (error, result) => {
            if (error) return res.status(500).json(({resultCode: 1}))

            const sql_all = "DELETE FROM all_products WHERE uniqCode = ?"
            const data_all = [req.params.id]

            pool.query(sql_all, data_all, (error, result) => {
                if (error) return res.status(500).json(({resultCode: 1}))

                return res.status(201).json({resultCode: 0})
            })
        })

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}

const removeProductItem = (req, res, next) => {
    try {

        const sql = "DELETE FROM all_products WHERE id = ?"
        const data = [req.params.id]

        pool.query(sql, data, (error, result) => {
            if (error) return res.status(500).json(({resultCode: 1}))

            return res.status(201).json({resultCode: 0})
        })

    } catch (err) {
        next(createError(400, 'Что-то пошло не так'))
    }
}


module.exports = {
    removeProduct,
    removeProductItem,
}