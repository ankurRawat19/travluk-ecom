const jwt = require("jsonwebtoken");
const config = require("../config")

function isAuthenticated(req, res, next) {
    // Extract token from authorization header
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Verify the token using the JWT library and the secret key
        const decodedToken = jwt.verify(token, config.jwtSecret);
        req.user = decodedToken;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = isAuthenticated;