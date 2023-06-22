const express = require('express');
const jwt = require('jsonwebtoken');


const app = express();
app.use(express.json());

// Secret key for signing and verifying tokens
const secretKey = 'your-secret-key';

// Sample user database (replace this with your own user authentication logic)
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// Sample user sessions (replace this with your own session management logic)
const activeSessions = {};

// Route for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find the user with the provided username and password
    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
    }

    // Generate an access token
    const accessToken = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn: '15m' // Access token expires in 15 minutes
    });

    // Generate a refresh token
    const refreshToken = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn: '7d' // Refresh token expires in 7 days
    });

    // Store the refresh token in active sessions
    activeSessions[refreshToken] = true;

    res.json({ accessToken, refreshToken });
});



// Route for refreshing access token
app.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;

    // Check if the refresh token is valid
    jwt.verify(refreshToken, secretKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ error: 'Invalid refresh token' });
            return;
        }

        // Generate a new access token
        const accessToken = jwt.sign({ userId: decoded.userId }, secretKey, {
            expiresIn: '15m' // Access token expires in 15 minutes
        });

        res.json({ accessToken });
    });
});




// Route for user logout
app.post('/logout', (req, res) => {
    const { refreshToken } = req.body;

    // Invalidate the refresh token and remove it from active sessions
    delete activeSessions[refreshToken];

    res.json({ message: 'Logout successful' });
});





// Example protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});

// Middleware for verifying access token and active session
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access token not provided' });
        return;
    }

    // Verify the access token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'Invalid access token' });
            return;
        }

        req.userId = decoded.userId;

        // Check if the refresh token is still active
        if (!activeSessions[token]) {
            res.status(401).json({ error: 'Invalid session' });
            return;
        }

        next();
    });
}

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
