
/*jslint node:true*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');



// Use body parser to parse JSON body
app.use(bodyParser.json());

var connAttrs = {
    "user": "SYSTEM",
    "password": "mh3364060",
    "connectString": "localhost/XE"
};

// Http method: POST
// URI        : /registrar_compra_helado
// Crea una nueva compra de helados
app.post('/registrar_compra_helado', function (req, res) {
    "use strict";
    if ("application/json" !== req.get('Content-Type')) {
        res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null
        }));
        return;
    }
    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("INSERT INTO COMPRAS_HELADOS VALUES " +
            "(:CANTIDAD, :SABOR, :PRECIO_UNITARIO, :FECHA) ", [req.body.CANTIDAD, req.body.SABOR,
            req.body.PRECIO_UNITARIO, req.body.FECHA], {
                autoCommit: true,
                outFormat: oracledb.OBJECT // Return the result as Object
            },
            function (err, result) {
                if (err) {
                    // Error
                    res.set('Content-Type', 'application/json');        
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err,
                        detailed_message: err.message
                    }));          
                } else {
                    // Successfully created the resource
                    res.status(201).set('Location', '/registrar_compra_helado/' + req.body.CANTIDAD).end();
                }
                // Release the connection
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("POST /registrar_compra_helado : Connection released");
                        }
                    });
            });
    });
});

// Http method: POST
// URI        : /registrar_compra_cerveza
// Crea una nueva compra de cerveza
app.post('/registrar_compra_cerveza', function (req, res) {
    "use strict";
    if ("application/json" !== req.get('Content-Type')) {
        res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null
        }));
        return;
    }
    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("INSERT INTO COMPRAS_CERVEZAS VALUES " +
            "(:CANTIDAD, :PRECIO_UNITARIO, :FECHA) ", [req.body.CANTIDAD,
            req.body.PRECIO_UNITARIO, req.body.FECHA], {
                autoCommit: true,
                outFormat: oracledb.OBJECT // Return the result as Object
            },
            function (err, result) {
                if (err) {
                    // Error
                    res.set('Content-Type', 'application/json');        
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err,
                        detailed_message: err.message
                    }));          
                } else {
                    // Successfully created the resource
                    res.status(201).set('Location', '/registrar_compra_cerveza/' + req.body.CANTIDAD).end();
                }
                // Release the connection
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("POST /registrar_compra_cerveza : Connection released");
                        }
                    });
            });
    });
});

// Http method: POST
// URI        : /registrar_venta_helado
// Crea una nueva venta de helados
app.post('/registrar_venta_helado', function (req, res) {
    "use strict";
    if ("application/json" !== req.get('Content-Type')) {
        res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null
        }));
        return;
    }
    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("INSERT INTO VENTAS_HELADOS VALUES " +
            "(:CANTIDAD, :SABOR, :PRECIO_VENTA, :FECHA_VENTA, :CLIENTE) ", [req.body.CANTIDAD,
                req.body.SABOR, req.body.PRECIO_VENTA, req.body.FECHA_VENTA, req.body.CLIENTE], {
                autoCommit: true,
                outFormat: oracledb.OBJECT // Return the result as Object
            },
            function (err, result) {
                if (err) {
                    // Error
                    res.set('Content-Type', 'application/json');        
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err,
                        detailed_message: err.message
                    }));          
                } else {
                    // Successfully created the resource
                    res.status(201).set('Location', '/registrar_venta_helado/' + req.body.CANTIDAD).end();
                }
                // Release the connection
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("POST /registrar_venta_helado : Connection released");
                        }
                    });
            });
    });
});

// Response in root
app.get('/', function (req, res) {
    res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


// var path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));

var server = app.listen(8000, "0.0.0.0", function () {
    "use strict";

    var host = server.address().address,
        port = server.address().port;

    console.log(' Server is listening at http://%s:%s', host, port);
});