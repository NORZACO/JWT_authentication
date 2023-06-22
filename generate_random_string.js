// Importing required modules
const fs = require('fs');
const path = require('path');
// const { uid } = require('uid')




// Function to generate a random string using the crypto module
function generateRandomString() {
  return require('crypto').randomBytes(64).toString('hex');
}

// Getting the path to the .env file
const envPath = path.resolve(__dirname, '.env');

// Array of environment variables to set
const envVars = [

  'HOST=127.0.0.1',

  'PORT=3000',
 
 
  '\n\n',
  `#THIS IS OUR SECRET GENERATED ACCESS TOKEN `,
  `ACCESS_TOKEN_SECRET=${generateRandomString()}`, // setting the access token secret as a randomly generated string,
  `REFRESH_TOKEN_SECRET=${generateRandomString()}`, // setting the access token secret as a randomly generated string
];

// Appending the environment variables to the .env file
envVars.forEach((envVar) => fs.appendFileSync(envPath, `${envVar}\n`)); // Each environment variable is appended with 3 new line characters for readability.
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