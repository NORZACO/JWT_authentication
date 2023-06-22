require('dotenv').config();
const fsPromise = require('fs').promises
const path = require('path');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersDB = { users: require('../model/users.json'), /* Load user data from JSON file*/
 setUsers: function (data) { 
    this.users = data 
} /* Method to set user data */ }

// Extract the access and refresh token secrets from the environment variables
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const handleLogout = async (req, res) => {
    // on client,also delete the access token


    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    console.log('COOKIES JWT: ', cookies.jwt);

    const refreshToken = cookies.jwt;

    // is the user is database
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

    if (!foundUser) {
        // clear cook
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(401); // Unauthorized if user is not found in the user database
    }

    // detele refresh token in database
    const otherUser = usersDB.users.filter(person => person.refreshToken !== refreshToken);
    // current user
    const currentUser = { ...foundUser, refreshToken : ''}
    // add current user to other user
    usersDB.setUsers([...otherUser, currentUser]);
    // write to file
    const userjSON = path.join(__dirname, '../model/users.json')
    const userStringfy = JSON.stringify(usersDB.users)
    await fsPromise.writeFile(userjSON, userStringfy);

    // clear cook
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', /*secure: true */ });
    res.sendStatus(204); // no comtent
};

module.exports = { handleLogout };
