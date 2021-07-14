var jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const sql = require("mssql/msnodesqlv8");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = async (req, res, next) => {
    var config = {
        driver: 'msnodesqlv8',
        connectionString: 'Driver=SQL Server;Server=DESKTOP-ND0KI3A;Database=users;Trusted_Connection=true;',
    };
    await sql.connect(config, err => {
        console.log(req.body);
        var request = new sql.Request();
        request.input("userId", sql.Numeric, req.userId);
        request.query('select * from user_roles where userId=@userId', (err, result) => {
            if (err) {
                console.log("select Error ", err);
                res.send({ status: 'Error', message: 'serverError', errorMessage: err });
                return;
            }
            console.log("result ", result);
            if (!result.recordset || result.recordset.length <= 0) {
                res.status(401).send({ status: 'Error', message: 'Unauthorized. Require Admin Role!', errorMessage: '' });
                return;
            }
            let authorized = false
            result.recordset.every((val) => {
                if (val.RoleId === 2) {
                    authorized = true
                    return;
                }
            })
            if (authorized) {
                next();
                return;
            }
            res.status(401).send({ status: 'Error', message: 'Unauthorized. Require Admin Role!', errorMessage: '' });
            return;
        });

    });
    sql.on('error', err => { // Connection borked.
        console.log("Connection not success ", err);
        res.send({ status: 'error', message: "Server connection error", errorMessage: err });
        return;
    });
};

isUser = async (req, res, next) => {
    var config = {
        driver: 'msnodesqlv8',
        connectionString: 'Driver=SQL Server;Server=DESKTOP-ND0KI3A;Database=users;Trusted_Connection=true;',
    };
    await sql.connect(config, err => {
        console.log(req.body);
        var request = new sql.Request();
        request.input("userId", sql.Numeric, req.userId);
        request.query('select * from user_roles where userId=@userId', (err, result) => {
            if (err) {
                console.log("select Error ", err);
                res.send({ status: 'Error', message: 'serverError', errorMessage: err });
                return;
            }
            console.log("result ", result);
            if (!result.recordset || result.recordset.length <= 0) {
                res.status(401).send({ status: 'Error', message: 'Unauthorized', errorMessage: '' });
                return;
            }
            let authorized = false
            result.recordset.every((val) => {
                if (val.RoleId === 1) {
                    authorized = true
                    return;
                }
            })
            if (authorized) {
                next();
                return;
            }
            res.status(401).send({ status: 'Error', message: 'Unauthorized', errorMessage: '' });
            return;
        });

    });
    sql.on('error', err => { // Connection borked.
        console.log("Connection not success ", err);
        res.send({ status: 'error', message: "Server connection error", errorMessage: err });
        return;
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isUser: isUser,
};
module.exports = authJwt;