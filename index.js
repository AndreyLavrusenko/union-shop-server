const express = require("express")

const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const passport = require("passport");
const passportSetup = require('./passport')

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const systemRoute = require("./routes/system");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

require('dotenv').config()

const app = express();

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}))
app.use(cookieParser())
app.use(express.json())
app.use(session({secret: "this_is_a_secret"}));
app.use(passport.initialize());
app.use(passport.session());

// Вход в аккаунт
app.use("/auth", authRoute);
// Товары
app.use("/product", productRoute)
// Корзина
app.use("/cart", cartRoute)
// Заказ
app.use("/order", orderRoute)
// Система
app.use("/system", systemRoute)



app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    return res.status(status).json({
        resultCode: 1,
        status,
        message,
    })
})

const PORT = process.env.PORT || 8080


app.listen(PORT, () => {
    console.log('Server start')
})