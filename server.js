const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = 8080

app.use(cors())

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))

//app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

app.get('/tr.js', async(req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const endpoint = "https://white-octopus-98.telebit.io/tr_receive";

    let js = fs.readFileSync(path.join(__dirname, 'public/tr/tr.js')).toString();

    js = js.replaceAll('{{ENDPOINT}}', endpoint)
    js = js.replaceAll('{{IP}}', ip)

    res.setHeader("Content-Type", "text/javascript");
    res.send(js)
})

app.post('/tr_receive', async(req, res) => {
    const { fnName, params, CLT } = req.body

    console.log(`[RCV> ${fnName}] `, JSON.stringify(params))
    console.dir(`CLT: `, CLT)
    console.dir('HEADERS: ', req.headers)

    res.json({
        success: true,
        message: 'tracked',
    })
})

app.listen(PORT);
console.log(`CLT: Listening on port ${PORT}`);