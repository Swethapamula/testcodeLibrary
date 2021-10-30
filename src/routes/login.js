const express = require('express');
let loginrouter = express.Router();
const Signupdata=require('../model/Signupdata');


function logrouter(){
//signin mongo check up and admin validation

loginrouter.get('/', function (req, res) {
    res.render('login');
});

//postlogin mongo validation

loginrouter.post('/', function (req, res) {

    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;

    // mongo check for user
    if (username == 'admin' && password == '1234') {
        req.session.role = 'admin';
        console.log("admin login success")
        res.render("login")

    } else {
        Signupdata.findOne({ Username: username, Password: password }, function (err, user) {
            if (err) {
                res.send({ status: false, data: 'Response error. No Internet' });

            }
            else if (user) {
                console.log("user data", user)
                req.session.role = 'user';
                res.render("login")
            } else {
                res.send(' USER NOT FOUND');
            }

        });
    }
});
return  loginrouter;
}

module.exports = logrouter;