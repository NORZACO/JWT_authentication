require('dotenv').config();
// const fs = require('fs');
// const path = require('path');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersDB = { users: require('../model/users.json'), /* Load user data from JSON file*/ setUsers: function (data) { this.users = data } /* Method to set user data */ }

// Extract the access and refresh token secrets from the environment variables
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized if JWT cookie is missing

    console.log('COOKIES JWT: ', cookies.jwt);

    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

    if (!foundUser) return res.sendStatus(401); // Unauthorized if user is not found in the user database

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded_jwt_token) => {
        if (err || foundUser.username !== decoded_jwt_token.username) {
            return res.sendStatus(403); // Forbidden if JWT verification fails or username doesn't match
        }

        const accessToken = jwt.sign(
            { 'username': decoded_jwt_token.username },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' }
        ); // Generate new access token


        res.json({ accessToken }); // Send the access token to the client
    });
};

module.exports = { handleRefreshToken };
