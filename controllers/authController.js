require('dotenv').config(); // Import dotenv for environment variables'

// Importing required modules
const fs = require('fs');
const path = require('path');


const usersDB = {
    users: require('../model/users.json'), // Load user data from JSON file
    setUsers: function (data) { this.users = data } // Method to set user data
}
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
// jwt
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWTs

// Extract the access and refresh token secrets from the environment variables
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;


const handleLogin = async (req, res) => {

    // Extract username and password from request body
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' }); // Check if username and password are provided

    const foundUser = usersDB.users.find(person => person.username === user); // Find user in the user database

    if (!foundUser) return res.sendStatus(401); // Unauthorized if user is not found

    const match = await bcrypt.compare(pwd, foundUser.password); // Compare the provided password with the hashed password in the database

    if (match) {
        // Passwords match, create JWTs (JSON Web Tokens)
        const accessToken = jwt.sign({ 'username': foundUser.username }, ACCESS_TOKEN_SECRET, { expiresIn: "60s" }); // Create access token
        const refreshToken = jwt.sign({ 'username': foundUser.username }, REFRESH_TOKEN_SECRET, { expiresIn: '1d' }); // Create refresh token


        // saving freshing token with currennt user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken }; // Add the refresh token to the user in the database
        usersDB.setUsers([...otherUsers, currentUser]); // Update the user database
        // save user in JWT_authentication\model\users.json json file
        fs.writeFileSync(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users, null, 2));


        // // Send the access token to the client inside a cookie
        // res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });


        // Send the refresh token to the client inside a cookie
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure : true, maxAge: 1000 * 60 * 60 * 24 });

        // Save the tokens into the session object so that they can be used by all routes
        // req.session.accessToken = accessToken;
        // req.session.refreshToken = refreshToken;
        // console.log("Logged In");



        // Getting the path to the .env file
        const envPath = path.resolve(__dirname, '..', 'http.http');
        // Check if the environment file exists
        if (fs.existsSync(envPath)) {
            // Delete the existing environment file
            fs.unlinkSync(envPath);
            console.log('Existing environment file deleted.');
        }

        // Create a new environment file
        const envContent = [
            `@TOKEN=${accessToken}`,
            '',
            'POST http://127.0.0.1:3000/auth',
            'Content-Type: application/json',
            '',
            JSON.stringify({
                user: 'walt1',
                pwd: 'Aa$12345'
            }),
            '###',
            '',
            'GET http://127.0.0.1:3000/refresh',
            'Content-Type: application/json',
            '',
            JSON.stringify({
                user: 'walt1',
                pwd: 'Aa$12345'
            }),
            '###',
            '',
            'GET http://127.0.0.1:3000/employees',
            'Content-Type: application/json',
            'Authorization: Bearer {{TOKEN}}',
            '###',
            '',
            'POST http://127.0.0.1:3000/employees',
            'Content-Type: application/json',
            'Authorization: Bearer {{TOKEN}}',
            '',
            JSON.stringify({
                firstname: 'Mwamuzi',
                lastname: 'Shada'
            })
        ];

        fs.writeFileSync(envPath, envContent.join('\n'));

        console.log('New environment file created.');

        const logo = [
            "\x1b[32m   ____        _         \x1b[0m",
            "\x1b[32m  / __ \\      (_)        \x1b[0m",
            "\x1b[32m | |  | |_ __  _ _ __    \x1b[0m",
            "\x1b[32m | |  | | '_ \\| | '_ \\   \x1b[0m",
            "\x1b[32m | |__| | |_) | | | | |  \x1b[0m",
            "\x1b[32m  \\____/| .__/|_|_| |_|  \x1b[0m",
            "\x1b[32m        | |              \x1b[0m",
            "\x1b[32m        |_|              \x1b[0m"
        ];

        console.log(logo.join("\n"));


        // Sed the access token to the client
        res.json({ accessToken });
    } else {
        // Passwords do not match
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }; // Export the handleLogin function for usage in other modules
