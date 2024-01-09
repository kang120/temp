const express = require('express')
const cors = require('cors')
const { execSync } = require('child_process');
//const mysql = require('mysql2')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3001

app.use(express.json());
app.use(cors());

//const conn = mysql.createConnection(process.env.DATABASE_URL);

app.post('/api/check_plagiarism', (req, res) => {
    console.log(req.file);
    res.send({ result: 'success' });
})


app.listen(port, () => {
    console.log(`Listening to port ${port}...`)
})