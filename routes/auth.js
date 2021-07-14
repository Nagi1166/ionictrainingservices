var express = require('express');
var router = express.Router();
const sql = require("mssql/msnodesqlv8");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/auth.config.js");

router.post('/login', async function (req, res, next) {
    console.log("Request ", req.body);
    var config = {
        driver: 'msnodesqlv8',
        connectionString: 'Driver=SQL Server;Server=DESKTOP-ND0KI3A;Database=users;Trusted_Connection=true;'
    }
    await sql.connect(config, err => {
        var request = new sql.Request();
        request.input("mobile", sql.VarChar, req.body.mobile);
        request.input("password", sql.VarChar, req.body.password);

        request.query('select * from users where mobile=@mobile and password=@password', (err, result) => {
            if (err) {
                console.log("Select Error ", err);
                res.send({ status: 'Error', message: 'serverError', errorMessage: err });
                return;
            }
            console.log("result", result);
            if (!result || !result.recordset || result.recordset.length <= 0) {
                console.log("User is already available");
                res.send({ status: 'Error', message: 'User is not available. Please register', errorMessage: err });
                return;
            }
            var userId = result.recordset[0].ID;
            var userName = `${result.recordset[0].FirstName} ${result.recordset[0].LastName}`;
            var userEmail = result.recordset[0].email;
            request.input("userId", sql.Numeric, userId);
            request.query('select * from user_Roles UR Inner Join Roles R ON R.ID = UR.RoleId WHERE UR.UserId=@userId', (err, rolesResult) => {
                if (err) {
                    console.log("Select Error ", err);
                    res.send({ status: 'Error', message: 'serverError', errorMessage: err });
                    return;
                }
                console.log("roles result", rolesResult);
                if (!rolesResult || !rolesResult.recordset || rolesResult.recordset.length <= 0) {
                    res.send({ status: 'Error', message: 'User roles are not available. Please register', errorMessage: err });
                    return;
                }
                const roles = [];
                rolesResult.recordset.forEach((element) => {
                    roles.push(element["Role"])
                })
                var token = jwt.sign({ id: userId }, jwtConfig.secret, {
                    expiresIn: 86400 // 24 hours
                });
                res.status(200).send({
                    status: 'success',
                    id: userId,
                    username: userName,
                    email: userEmail,
                    roles: roles,
                    accessToken: token
                });
            });
        });
    });
    sql.on('error', err => { // Connection borked.
        console.log("Connection not success ", err);
        res.send({ status: 'Error', message: 'serverConnectionError', errorMessage: err });
    });
});

module.exports = router;