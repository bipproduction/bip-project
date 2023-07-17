const fs = require('fs')
const _ = require('lodash')
const dotenv = require('dotenv')

const envPath = '.env.local';
// Check if .env.local file exists
if (!fs.existsSync(envPath)) {
    // Create .env.local file
    fs.writeFileSync(envPath, '');
    console.log('.env.local file created successfully.');
}

const config = dotenv.parse(fs.readFileSync('.env.local', 'utf8'))

function set(key, value) {
    config[key] = value
    const data = _.keys(config)
        .map((k) => `${k}=${config[k]}`)
        .join('\n')

    fs.writeFileSync(envPath, data)
}

function get(key) {
    return config[key]
}

function remove(key) {
    delete config[key]
    const data = _.keys(config)
        .map((k) => `${k}=${config[k]}`)
        .join('\n')
    fs.writeFileSync(envPath, data)
}

module.exports = {
    set,
    get,
    remove
}
