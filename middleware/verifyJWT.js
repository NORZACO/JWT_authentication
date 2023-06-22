require('dotenv').config(); // Import dotenv for environment variables'
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWTs

const VerifyJWT = async function (req, res, next) {
    const authHeader = req.headers['authorization']; // Extract the authorization header from the request
    // check header
    if (!authHeader) return res.sendStatus(401); // Unauthorized if header is not found

    var token = authHeader.split(' ')[1]; // Extract the token from the header

    console.log("auth header: " + JSON.stringify(authHeader)); // Log the authorization header
    console.log("token: " + JSON.stringify(token)); // Log the extracted token

    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded_info) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid

        console.log("decoded_result: " + JSON.stringify(decoded_info)); // Log the decoded token information

        req.user = decoded_info.username; // Set the username from the decoded token information in the request object
        next(); // Call the next middleware function
    });
}

module.exports = VerifyJWT; // Export the authenticateToken middleware for usage in other modules










// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const jsend = require('jsend');


// async function authenticateToken(req, res, next) {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];



//     // if token null = Missing or invalid JWT token. Please include a valid token in the Authorization header of your request
//     if (token == null) {
//         return res.status(403).json({
//             'result': 'Missing or invalid JWT token. Please include a valid token in the Authorization header of your request.'
//         });

//     }




//     const options = { expiresIn: '60s' } // 2 minutes

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, options, (err, user) => {
//         if (err) {
//             return res.status(403).json({
//                 message: 'Invalid JWT token. Please include a valid token in the Authorization header of your request.'
//             });
//         }
//         req.user = user.username
//         next();
//     });
// }


