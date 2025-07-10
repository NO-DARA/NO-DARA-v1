const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "𝙰𝚂𝙸𝚃𝙷𝙰-𝙼𝙳=cVBihTjR#uWBXAL4T1c5RsjwEzluQpX4jE9d3SRBvFqOEUXWJ-ow",
MONGODB: process.env.MONGODB || "",//enter mongo db url
};
