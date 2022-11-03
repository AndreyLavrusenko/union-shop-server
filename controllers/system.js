const createError = require("../error");
const {pool} = require("../db");

const getCopyright = async = (req, res, next) => {
    try {
        const sql = `SELECT copyright FROM system`;

        pool.query(sql, (error, result) => {
            if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

            return res.status(200).json(...result)

        })
    } catch (err) {
        next(createError(404, "Advertising not found"))
    }
}


module.exports = {
    getCopyright,
}