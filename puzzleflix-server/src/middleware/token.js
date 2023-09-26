const jwt = require("jsonwebtoken");

//dotenv
require("dotenv").config();

//generates tokens
const jwtTokens = (userid, username, email) => {
    const user = { userid, username, email };

    const accessExpiresIn = "20000s";
    const refreshExpiresIn = "20000s";

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: accessExpiresIn,
    });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: refreshExpiresIn,
    });

    var now = new Date();
    accessExpiryDate = new Date(now.getTime() + 20000000);
    refreshExpiryDate = new Date(now.getTime() + 20000000);

    return {
        status: 1,
        accessToken,
        refreshToken,
        accessExpiryDate,
        refreshExpiryDate,
    };
};

module.exports = {
    jwtTokens,
};
