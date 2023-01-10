const createError = require("../../error");
const {pool} = require("../../db");
const path = require("path")

// Сохранение всей информации о товаре в таблицу product
const createNewProduct = async (req, res, next) => {
    try {

        const {name: title, description, exactCategory, cardColor, titleColor, subtitleColor, isLogo, about, recommendation, sizeGrid} = JSON.parse(req.body.productInfo)
        const uniqCode = Date.now()

        const category = JSON.parse(req.body.categoryProduct)

        const name = req.files.file.name
        const file = req.files.file
        const ext = path.extname(file.name)
        const url = `/product-img/img/${name}`


        const fileArr = req.files.filesArr
        const filesArrSize = req.files.filesArrSize


        // Записывает в массив ссылки на картинки и сохраняет в бд
        const arrWithUrlForSecondImages = []
        if (fileArr) {
            if (fileArr.length) {
                fileArr.forEach(img => {
                    arrWithUrlForSecondImages.push(`/product-img/img/${img.name}`)
                })
            } else {
                arrWithUrlForSecondImages.push(`/product-img/img/${fileArr.name}`)
            }
        }

        const arrWithUrlForSizeImages = [];
        if (filesArrSize) {
            if (filesArrSize.length) {
                filesArrSize.forEach(img => {
                    arrWithUrlForSizeImages.push(`/product-img/size/${img.name}`)
                })
            } else {
                arrWithUrlForSizeImages.push(`/product-img/size/${filesArrSize.name}`)
            }
        }


        await saveImgHandler(fileArr, 'img')
        await saveImgHandler(filesArrSize, 'size')


        async function saveImgHandler(fileArrName, folder) {
            // Если картинок много
            if (fileArrName) {
                if (fileArrName.length) {
                    fileArrName?.map( async (img) => {
                        await img.mv(`./public/product-img/${folder}/${img.name}`)
                    })
                    // Если картинка одна
                } else {
                    await fileArrName.mv(`./public/product-img/${folder}/${fileArrName.name}`)
                }
            }
        }


        const allowedType = ['.png', '.jpg', '.jpeg', '.webp']


        const sql = "INSERT INTO product (uniqCode, title, description, categories, category_type, color, subColor, backgroundcolor, isLogo, image, image_arr, about, recommend, sizeGrid, sizeImg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        const data = [uniqCode, title, description, category.category, exactCategory, titleColor, subtitleColor, cardColor, isLogo, url, JSON.stringify(arrWithUrlForSecondImages), about, recommendation, sizeGrid, JSON.stringify(arrWithUrlForSizeImages)]

        // Если тип файла не подходит
        if (!allowedType.includes(ext.toLowerCase())) return res.json({resultCode: 1, message: "Invalid file"}).status(422)

        // Сохранение главного изображения
        await file.mv(`./public/product-img/img/${name}`, async (err) => {
            if (err) return res.status(500).json(({resultCode: 1}))

            try {
                pool.query(sql, data, (error, result) => {
                    if (error) return res.status(400).json({message: "Product's not created", resultCode: 1})

                    return res.status(201).json({resultCode: 0})
                })

            } catch (err) {
                console.log(err.message)
            }
        })


    } catch (err) {
        next(createError(400, 'Что-то пошло не так'))
    }
}


module.exports = {
    createNewProduct,
}