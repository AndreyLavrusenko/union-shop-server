const passport = require("passport");
const VKontakteStrategy = require("passport-vkontakte").Strategy;
const YandexStrategy = require("passport-yandex").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()


passport.use(
    new VKontakteStrategy({
            clientID: process.env.VK_CLIENT_ID,
            clientSecret: process.env.VK_CLIENT_SECRET,
            callbackURL: `http://localhost:${process.env.PORT}/auth/vkontakte/callback`,
        },
        function (accessToken, refreshToken, params, profile, done) {
            return done(null, profile);
        }
    ));


passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACK_URI}/auth/google/callback`,
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    ));


passport.use(
    new YandexStrategy({
            clientID: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET,
            callbackURL: `${process.env.BACK_URI}/auth/yandex/callback`
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    ));


passport.serializeUser(function (user, done) {
    done(null, {id: user.id, provider: user.provider});
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});



