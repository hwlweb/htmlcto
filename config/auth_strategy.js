"use strict";

const passport = require('passport');
const qqStrategy = require('passport-qq').Strategy;

/**
 * QQ API
 */
passport.use(new qqStrategy({
        clientID: "101273951",
        clientSecret: "f9c4439a9ee9c2fbfe686e73385df0e9",
        callbackURL: "http://www.htmlcto.com/auth/qq/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));