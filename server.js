var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var cloud = true;
var mongodbDatabase = 'heladosdb';
var url = "mongodb://SYSTEM:12345@ds257848.mlab.com:57848/heladosdb";

// Use body parser to parse JSON body
app.use(bodyParser.json());

// Http method: POST
// URI        : /inicializar_sabores
// Inicializa los valores del ui-select
app.post('/inicializar_sabores', function (req, res) {
    "use strict";
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");
        dbo.collection("sabores").find().toArray(function (err, resp) {
            if (err) {
                res.send(500, err);
                return;
            } else {
                console.log("Inicializar sabores");
                res.send(201, resp);
            }
            db.close();
        });
    });
});

// Http method: POST
// URI        : /inicializar_clientes
// Inicializa los valores del ui-select
app.post('/inicializar_clientes', function (req, res) {
    "use strict";
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");
        dbo.collection("clientes").find({}).toArray(function (err, resp) {
            if (err) {
                res.send(500, err);
                return;
            } else {
                console.log("Inicializar clientes");
                res.send(201, resp);
            }
            db.close();
        });
    });
});

// Http method: POST
// URI        : /agregar_sabor
// Agrega un sabor a la BD
app.post('/agregar_sabor', function (req, res) {
    "use strict";
    VerifyJson(req);
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log("Error en agregarSabores" + err);
        var dbo = db.db("heladosdb");
        req.body.sabor = toTitleCase(req.body.sabor);
        dbo.collection("sabores").findOne({ "sabor": req.body.sabor }, function (err, resp) {
            if (resp) {
                res.status(202).send("El sabor ya existe");
            } else {
                dbo.collection("sabores").insertOne(req.body, function (err, resp) {
                    if (err) {
                        res.send(500, err);
                        return;
                    } else {
                        console.log("Sabor agregado");
                        res.send(201, resp);
                    }
                    db.close();
                });
            }
            db.close();
        });
    });
});

// Http method: POST
// URI        : /agregar_cliente
// Agrega un cliente a la BD
app.post('/agregar_cliente', function (req, res) {
    "use strict";
    VerifyJson(req);
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log("Error en agregarclientes" + err);
        var dbo = db.db("heladosdb");
        req.body.cliente = toTitleCase(req.body.cliente);
        dbo.collection("clientes").findOne(
            { "cliente": req.body.cliente },
            function (err, resp) {
                if (resp) {
                    res.status(202).send("El cliente ya existe");
                } else {
                    dbo.collection("clientes").insertOne(req.body, function (err, resp) {
                        if (err) {
                            res.send(500, err);
                            return;
                        } else {
                            console.log("Cliente agregado");
                            res.send(201, resp);
                        }
                        db.close();
                    });
                }
                db.close();
            });
    });
});


// Http method: POST
// URI        : /registrar_compra_cerveza
// Crea una nueva compra de cerveza
app.post('/registrar_compra_cerveza', function (req, res) {
    "use strict";
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");
        req.body.type = "cerveza";
        dbo.collection("compras").insertOne(req.body, function (err, resp) {
            if (err) {
                res.send(500, err);
                return;

            } else {
                console.log("Compra de cerveza realizada!");
                //Modificar inventario
                dbo.collection("inventario").updateOne(
                    {
                        "precio": req.body.precio_unitario,
                        "type": "cerveza"
                    },
                    {
                        $inc: {
                            "cantidad": req.body.cantidad
                        }
                    },
                    {
                        upsert: true,
                    }, function (err, resp) {
                        if (err) {
                            res.send(500, err);
                            return;

                        } else {
                            console.log("Inventario actualizado");
                            res.send(201, "Everything went alright");
                        }
                        db.close();
                    });
            }
            db.close();
        });
    });
});

// Http method: POST
// URI        : /registrar_compra_helado
// Crea una nueva compra de helado
app.post('/registrar_compra_helado', function (req, res) {
    "use strict";
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");
        req.body.type = "helado";
        //Registrar la compra
        dbo.collection("compras").insertOne(req.body, function (err, resp) {
            if (err) {
                res.send(500, err);
                return;

            } else {
                console.log("Compra de helado realizada!");
                //Modificar inventario
                if(req.body.precio_unitario >= 1500){
                    req.body.categoria = "Grande";
                }else{
                    req.body.categoria = "Pequeño";                    
                }
                dbo.collection("inventario").updateOne(
                    {
                        "sabor": req.body.sabor,
                        "precio": req.body.precio_unitario,
                        "type": "helado"
                    },
                    {
                        $inc: {
                            "cantidad": req.body.cantidad
                        }
                    },
                    {
                        upsert: true,
                    }, function (err, resp) {
                        if (err) {
                            res.send(500, err);
                            return;

                        } else {
                            console.log("Inventario actualizado");
                            res.send(201, "Everything went alright");
                        }
                        db.close();
                    });
            }
            db.close();
        });
    });
});

// Http method: POST
// URI        : /registrar_venta_cerveza
// Crea una nueva venta de cerveza
app.post('/registrar_venta_cerveza', function (req, res) {
    "use strict";
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");
        req.body.type = "cerveza";
        dbo.collection("ventas").insertOne(req.body, function (err, resp) {
            if (err) {
                res.send(500, err);
                return;

            } else {
                console.log("venta de cerveza realizada!");
                res.send(201, "Everything went alright");
            }
            db.close();
        });
    });
});

// Http method: POST
// URI        : /registrar_venta_helado
// Crea una nueva venta de helado
app.post('/registrar_venta_helado', function (req, res) {
    "use strict";
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");
        req.body.type = "helado";
        var validQty = dbo.collection('inventario').findOne(
            {
                "sabor": req.body.sabor,
                "cantidad": { $gte: req.body.cantidad }
            }, function (err, prod) {
                console.log(err, prod);
                if (prod == null) {
                    db.close();
                    res.send(203, "No hay tal cantidad en inventarios");
                    return;
                } else {
                    //Registrar la venta
                    dbo.collection("ventas").insertOne(req.body, function (err, resp) {
                        if (err) {
                            res.send(500, err);
                            return;

                        } else {
                            console.log("venta de helado realizada!");
                            dbo.collection("inventario").updateOne(
                                {
                                    "sabor": req.body.sabor,
                                    "type": "helado"
                                },
                                {
                                    $inc: {
                                        "cantidad": -req.body.cantidad
                                    }
                                },
                                {
                                    upsert: true,
                                }, function (err, resp) {
                                    if (err) {
                                        res.send(500, err);
                                        return;

                                    } else {
                                        console.log("Inventario actualizado");
                                        res.send(201, "Everything went alright");
                                    }
                                    db.close();
                                });
                        }
                        db.close();
                    });
                }
            });
    });
});
/**
 * @description Función que verifica que el elemento que reciba sea un Json
 * @author Miguel Ángel Henao Pérez
 * @param  {any} req 
 * @return  
 */
function VerifyJson(req) {
    if ("application/json" !== req.get('Content-Type')) {
        res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null
        }));
        return;
    }
}
/**
 * @description Pone los valores con las primeras letras en mayus
 * @author Miguel Ángel Henao Pérez
 * @param  {any} str 
 * @return  
 */
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

// Response in root
app.get('/', function (req, res) {
    res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.use('/public', express.static('public'));
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));

var server = app.listen(8000, "0.0.0.0", function () {
    "use strict";

    var host = server.address().address,
        port = server.address().port;

    console.log(' Server is listening at http://%s:%s', host, port);
});