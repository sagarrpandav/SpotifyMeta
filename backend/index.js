require('dotenv').config()
const axios = require('axios');
const PORT = process.env.PORT || 8888;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;

const path = require('path');
const express = require('express');
const querystring = require('querystring');
const e = require("express");
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

const generateRandomString = function (length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

app.get('/', (req, res) => {
    res.json({
        id: 1,
        name: "Sagar Pandav"
    });
});

app.get('/callback', function (req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
            json: true
        };
        axios({
            method: 'post',
            url: authOptions.url,
            data: authOptions.data,
            headers: authOptions.headers
        }).then(response => {
            if (response.status === 200) {
                const {access_token, refresh_token} = response.data;
                const queryParams = querystring.stringify({access_token, refresh_token});
                res.redirect(`${FRONTEND_URI}/?${queryParams}`)
                //res.send(`<pre>${JSON.stringify(response.data, null,  2)}</pre>`)
                // const {access_token, token_type} = response.data;
                // axios({
                //     method: 'get',
                //     url: 'https://api.spotify.com/v1/me',
                //     headers: {Authorization: `${token_type} ${access_token}`}
                // }).then(response => {
                //     res.send(`<pre>${JSON.stringify(response.data, null,  2)}</pre>`)
                // });
            } else {
                res.redirect(`/?${querystring.stringify({error: 'invalid token'})}`);
            }
        }).catch(err => {
            console.error("ERROR Occured!");
            res.send(err);
        })
    }
});

app.get('/refresh_token', function (req, res) {

    const refresh_token = req.query.refresh_token;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        },
        data: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }),
        json: true
    };

    axios({
        method: 'post',
        url: authOptions.url,
        data: authOptions.data,
        headers: authOptions.headers
    }).then(response => {
        res.send(response.data);
    }).catch(err => {
        res.send(err);
    })
});

app.get('/login', function (req, res) {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email user-top-read';
    console.log("Redirecting to Spotify Login");
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state
        }));
});

app.post('/request-access', function (req, res) {
    console.log();
    console.log(req.body);
    const {name, email} = req.body;
    const data = {
        service_id: 'service_oa0lh0j',
        template_id: 'template_gqemn05',
        user_id: 'R97xrN1r4_KjLX8Ki',
        accessToken: 'g_e29Hl6rOzmLPpD5KO1y',
        template_params: {
            'request_name': name,
            'request_email': email
        }
    };
    axios({
        url: "https://api.emailjs.com/api/v1.0/email/send",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data),
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.error(err);
        res.json({error: err});
    });
    res.json({success: true});
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
})

app.listen(PORT, () => {
    console.info('Express App Listening on port ' + PORT);
})