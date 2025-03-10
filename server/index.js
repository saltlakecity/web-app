const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
dotenv.config();

const app = express();
const PORT = 5000
app.listen(PORT, () => console.log(`server started on port ${5000}`))