const passport = require("passport");
const router = require('express').Router()
const jwt = require("jsonwebtoken")
const {singInByUnionId} = require("../controllers/auth");

const CLIENT_URI = "http://localhost:3000"

// Когда пользователь зашел в аккаунт отсылаем запрос сюда, что бы проверить
router.get("/login", (req, res, next) => {
    try {
        if (req.user.id) {
            const token = jwt.sign({id: req.user.id}, process.env.SECRET_JWT, {expiresIn: '30d'})
            return res
                .status(200)
                .json({
                    resultCode: 0,
                    message: "Successfully Login",
                    token
                })

        } else {
            return res.status(403).json({resultCode: 1, message: "Not Authorized"});
        }
    } catch (err) {
        next(err)
    }
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        return res.redirect(CLIENT_URI);
    });
});

// Вход в аккаунт через UnionID
router.post("/union/signin", singInByUnionId)



router.get('/vkontakte', passport.authenticate('vkontakte'));
router.get(
    "/vkontakte/callback",
    passport.authenticate("vkontakte", {
        successRedirect: CLIENT_URI,
    })
);


router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: CLIENT_URI,
    })
);


router.get('/yandex', passport.authenticate('yandex'));
router.get('/yandex/callback',
    passport.authenticate('yandex', {
        successRedirect: CLIENT_URI,
    })
);



module.exports = router;