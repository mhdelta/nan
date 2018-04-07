var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var spawn = require("child_process").spawn;

var cloud = true;
var mongodbDatabase = 'heladosdb';
var url = "mongodb://SYSTEM:12345@ds257848.mlab.com:57848/heladosdb";

// Use body parser to parse JSON body
app.use(bodyParser.json());

precioCompraHeladoGrande = 1500;
precioVentaHeladoGrande = 2500;

// Http method: POST
// URI        : /traer_inventario
// Inicializa los valores del ui-select
app.post('/traer_inventario', function (req, res) {
    "use strict";
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");
        dbo.collection("inventario").find().toArray(function (err, resp) {
            if (err) {
                res.send(500, err);
                return;
            } else {
                console.log("Traer inventario");
                res.send(201, resp);
            }
            db.close();
        });
    });
});

// Http method: POST
// URI        : /traer_ventas
// Inicializa los valores del ui-select
app.post('/traer_ventas', function (req, res) {
    "use strict";
    var totalVentas = 0;
    var arr_cant = [];
    var arr_sabor = [];

    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");

        var helado_mas_vendido;
        var helado_menos_vendido;
        dbo.collection("ventas").aggregate([
            { $match: { categoria: { $exists: true } } },
            {
                $group:
                    {
                        _id: {
                            'sabor': '$sabor',
                            'tamano': '$categoria',
                        },
                        cantidad_vendida: { $sum: '$cantidad' }
                    }
            },
            { $sort: { cantidad_vendida: -1 } }
        ]).toArray(function (err, docs) {
            console.log(err);
            helado_mas_vendido = docs[0];
            helado_menos_vendido = docs[docs.length - 1];
            if (err) {
                res.send(500, err);
                return;
            } else {
                console.log("Traer ventas, prod mas vendido");
                var resp = [];
                resp.push(helado_mas_vendido);
                resp.push(helado_menos_vendido);
                res.send(201, resp);
            }
            db.close();
        });
    });
});

// Http method: POST
// URI        : /traer_ventas
// Inicializa los valores del ui-select
app.post('/traer_ventas_mensuales', function (req, res) {
    "use strict";
    var totalVentas = 0;
    var arr_cant = [];
    var arr_sabor = [];

    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");


        dbo.collection("ventas").aggregate([
            { $sort: { fecha_venta: -1 } },
            {
                $group:
                    {
                        _id: {
                            'fecha': '$fecha_venta',
                            'type': '$type'
                        },
                        total_vendido: { $sum: { $multiply: ['$cantidad', '$precio_venta'] } }
                    }
            }
        ]).toArray(function (err, docs) {
            console.log(err);
            if (err) {
                res.send(500, err);
                return;
            } else {
                console.log("Ventas mensuales enviadas");
                res.send(201, docs);
            }
            db.close();
        });
    });
});

// Http method: POST
// URI        : /traer_clientes
// Inicializa los valores del ui-select
app.post('/traer_clientes', function (req, res) {
    "use strict";
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");
        dbo.collection("ventas").aggregate(
            // { $project: { _id: 0, cliente: 1 } },
            { $unwind: "$cliente" },
            {
                $group: {
                    _id: "$cliente",
                    total_comprado: {
                        $sum: {
                            $multiply: ['$cantidad', '$precio_venta']
                        }
                    }
                }
            },
            {$sort: {total_comprado: -1}},
            { $project: { _id: 0, cliente: "$_id", total_comprado: "$total_comprado"} }
        ).toArray(function (err, docs) {
            console.log(err);
            if (err) {
                res.send(500, err);
                return;
            } else {
                console.log("Clientes enviados");                
                res.send(201, docs);
            }
            db.close();
        });
    });
});

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
        //Modificar inventario
        if (req.body.precio_unitario >= precioCompraHeladoGrande) {
            req.body.categoria = "Grande";
        } else {
            req.body.categoria = "Pequeño";
        }
        //Registrar la compra
        dbo.collection("compras").insertOne(req.body, function (err, resp) {
            if (err) {
                res.send(500, err);
                return;

            } else {
                console.log("Compra de helado realizada!");
                dbo.collection("inventario").updateOne(
                    {
                        "sabor": req.body.sabor,
                        "precio": req.body.precio_unitario,
                        "categoria": req.body.categoria,
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
        var validQty = dbo.collection('inventario').findOne(
            {
                "type": "cerveza",
                "cantidad": { $gte: req.body.cantidad },
            }, function (err, prod) {
                if (prod == null) {
                    db.close();
                    res.send(203, "No hay tal cantidad en inventarios");
                    return;
                } else {
                    console.log(prod);

                    //Modificar inventario
                    dbo.collection("ventas").insertOne(req.body, function (err, resp) {
                        if (err) {
                            res.send(500, err);
                            return;

                        } else {
                            console.log("venta de cerveza realizada!");
                            dbo.collection("inventario").updateOne(
                                {
                                    "type": "cerveza",
                                    "precio": prod.precio
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

// Http method: POST
// URI        : /registrar_venta_helado
// Crea una nueva venta de helado
app.post('/registrar_venta_helado', function (req, res) {
    "use strict";
    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");
        req.body.type = "helado";
        if (req.body.precio_venta >= precioVentaHeladoGrande) {
            req.body.categoria = "Grande";
        } else {
            req.body.categoria = "Pequeño";
        }
        var validQty = dbo.collection('inventario').findOne(
            {
                "sabor": req.body.sabor,
                "type": "helado",
                "cantidad": { $gte: req.body.cantidad },
                "categoria": req.body.categoria
            }, function (err, prod) {
                if (prod == null) {
                    db.close();
                    res.send(203, "No hay tal cantidad en inventarios");
                    return;
                } else {
                    //Modificar inventario
                    dbo.collection("ventas").insertOne(req.body, function (err, resp) {
                        if (err) {
                            res.send(500, err);
                            return;

                        } else {
                            console.log("venta de helado realizada!");
                            dbo.collection("inventario").updateOne(
                                {
                                    "sabor": req.body.sabor,
                                    "categoria": req.body.categoria,
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

// Http method: POST
// URI        : /predicciones
// Realiza la prediccion para ventas de dos clientes
app.post('/predicciones', function (req, res) {
	"use strict";
	
	// En ese arreglo van los dos clientes que hay que investigar
	var cliente0 = req.body[0];
	var cliente1 = req.body[1];

	console.log("Cliente #0: ", cliente0);
	console.log("Cliente #1: ", cliente1);
	


	// Lo que hay que hacer es:
	// Recibir los dos equipos, realizar busquedas con sus nombres
	// en los documentos de ventas, promediar sus ventas, agrupados por sabores y {precio o tamano}
	// Luego promediar las respuestas de los dos equipos y emitir un resultado



    MongoClient.connect(url, function (err, db) {
        if (err) return console.log(err);
        var dbo = db.db("heladosdb");
		var ventas = dbo.collection("ventas");
		console.log("Accediendo al módulo de predicciones");
        ventas.aggregate([
			{ $match: { categoria: { $exists: true } } },
			{ $unwind : "$cliente" },
            {
                $group:
                    {
                        _id: {
							'cliente': cliente1,
                            'sabor': '$sabor',
							'tamano': '$categoria',
                        },
                        promedio_vendido: { $avg: '$cantidad'}
                    }
			},
            { $sort: { promedio_vendido: -1 } }
        ]).toArray(function (err, docs) {
			console.log(err);
			console.log(docs);
            // if (err) {
            //     res.send(500, err);
            //     return;
            // } else {
            //     console.log("Traer ventas, prod mas vendido");
            //     var resp = [];
            //     res.send(201, resp);
            // }
            db.close();
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
    //Run python file
    // var pythonProcess = spawn('python', ["./public/MachineLearning/hello.py"]);
    // pythonProcess.stdout.on('data', function (data) {
    //     // Do something with the data returned from python script
    //     console.log(data.toString());        
    // });
    //python file must loook like print("hello world")\n sys.stdout.flush()

    const Ejemplo = require('./public/functions.js');
    let ejemplo = new Ejemplo();
    
    

});



app.use('/public', express.static('public'));
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));

var server = app.listen(3000, "0.0.0.0", function () {
    "use strict";

    var host = server.address().address,
        port = server.address().port;

    console.log(' Server is listening at http://%s:%s', host, port);
});