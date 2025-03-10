const express = require('express');
const dotenv = require('dotenv')
const { Pool } = require('pg');
const cors = require('cors');
const bot = require('./telegram-test-bot')
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.get('/api/test', (req, res) => {
    return res.json({ message: 'backend zaebis class' });
});
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()