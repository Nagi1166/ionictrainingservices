const sql = require("mssql/msnodesqlv8");

exports.getUsers = async (req, res) => {
    var config = {
        driver: 'msnodesqlv8',
        connectionString: 'Driver=SQL Server;Server=DESKTOP-ND0KI3A;Database=users;Trusted_Connection=true;'
    }
    await sql.connect(config, err => {
        new sql.Request().query('select * from users', (err, result) => {
            if (err) {
                console.log("Error ", err);
                res.send({ status: 'Error', message: 'serverError', errorMessage: err });
            }
            else
                res.send({ status: 'success', message: '', result: result.recordset });
        });
    });
    sql.on('error', err => { // Connection borked.
        console.log("Connection not success ", err);
        res.send('connection error');
    });
};

exports.updateUser = async (req, res) => {
    console.log(req.params.id)
    console.log(req.body.mobile)
    console.log(req.file)
    // var config = {
    //     driver: 'msnodesqlv8',
    //     connectionString: 'Driver=SQL Server;Server=DESKTOP-ND0KI3A;Database=users;Trusted_Connection=true;'
    // }
    // await sql.connect(config, err => {
    //     new sql.Request().query('select * from users', (err, result) => {
    //         if (err) {
    //             console.log("Error ", err);
    //             res.send({ status: 'Error', message: 'serverError', errorMessage: err });
    //         }
    //         else
    //             res.send({ status: 'success', message: '', result: result.recordset });
    //     });
    // });
    // sql.on('error', err => { // Connection borked.
    //     console.log("Connection not success ", err);
    //     res.send('connection error');
    // });
};

exports.register = async (req, res) => {
    console.log("Request ", req.body);
    var config = {
        driver: 'msnodesqlv8',
        connectionString: 'Driver=SQL Server;Server=DESKTOP-ND0KI3A;Database=users;Trusted_Connection=true;'
    }
    await sql.connect(config, err => {
        var request = new sql.Request();
        request.input("LastName", sql.VarChar, req.body.lastName);
        request.input("FirstName", sql.VarChar, req.body.firstName);
        request.input("mobile", sql.VarChar, req.body.mobile);
        request.input("email", sql.VarChar, req.body.email);
        request.input("password", sql.VarChar, req.body.password);

        request.query('select * from users where email=@email or mobile=@mobile', (err, result) => {
            if (err) {
                console.log("Select Error ", err);
                res.send({ status: 'Error', message: 'serverError', errorMessage: err });
                return;
            }
            console.log("result", result);
            if (!result || !result.recordset || result.recordset.length > 0) {
                console.log("User is already available");
                res.send({ status: 'Error', message: 'User has been already registered. Please login', errorMessage: err });
                return;
            }
            request.query('Exec training_user_register @LastName,@FirstName,@mobile,@email,@password', (err, result) => {
                if (err) {
                    console.log("Insert Error ", err);
                    res.send({ status: 'Error', message: 'serverError', errorMessage: err });
                    return;
                }
                res.send({ status: 'success', message: 'User has been registered successfully', errorMessage: '' });
                return;
            });
        });
    });
    sql.on('error', err => { // Connection borked.
        console.log("Connection not success ", err);
        res.send({ status: 'Error', message: 'serverConnectionError', errorMessage: err });
    });
};