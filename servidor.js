/********************* Configuracion CORS *********************/
var cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}
 
/********************* Configuracion JTW *********************/
const jwt = require('jwt-simple');
const secretKey = "miClaveSecreta"; // clave de cifrado del token
const algorithm = "HS256"; // algoritimo cifrado del token
const expire = 24 * 60 * 60 * 1000; // Tiempo de expiracion en Milisegundos

/********************* Configuracion MySQL *********************/
const mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "Felipe123",
    database: "ass"
});
connection.connect(function(err) {
    if (err) {
        console.log("Error contectado a la base de datos", err);
        return;
    }
    console.log("Base de datos conectada");

/********************* EXPRESS *********************/
    const express = require("express");
    var app = express(); // crear la aplicacion express
    app.use("/", express.json({ strict: false })); // datos de body en JSON

/********************* HEADERS *********************/
    app.all("/", function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    });

 /********************* SOPA :-P *********************/   
    var soap = require('soap');
    var url = 'http://localhost:8080/EjemploMaster/services/Converter?wsdl';
// Almacen
    var urlAlmacen = 'http://localhost:8080/ode/deployment/bundles/BPELMaster/GestionAlmacen.wsdl';
    var urlProv1 = 'http://localhost:8080/ProyectoProveedores1/services/GestionProveedores?wsdl';
    var urlProv2 = 'http://localhost:8080/ProyectoProveedores2/services/GestionProveedores?wsdl';


    var urlCompleto = 'http://localhost:8080/ode/deployment/bundles/BPELMaster/ProyectoBPELMasterArtifacts.wsdl';


/********************* SOPA :-Proyecto *********************/
 /*
var args = {producto: 'ipad'};
soap.createClient(urlSoap, function(err, client){
    client.ComprobarStock(args, function(err,result) {
        if(err){
            console.log(err);
            return err;
        }
        console.log(result);
    });
}); */

     /********************* SOPA :- Almacen Stock *********************/

/********************* RAML *********************/
    const osprey = require("osprey");
    osprey.loadFile("./api.raml").then(function(middleware) { // cargar el API
        console.log("RAML cargado correctamente");
        app.use(cors())
        app.use("/api/v1/", middleware); // Analiza el api

        app.use(function(err, req, res, next) { // Verificar si hay error en el API
            console.log("Error en el API:", err);
            res.status(err.status).send("Error API. " + req.method + " " + req.url + ": " + JSON.stringify(err));
        });

     /********************* Verificacion de usuario *********************/
        app.post("/api/v1/login", cors(corsOptions), function(req, res) {
            console.log(req.body);
            var email = req.body.email;
            var contrasena = req.body.contrasena;
            var sql = "SELECT usu.id FROM usuario as usu Where usu.email = " + mysql.escape(email) +  " and usu.contrasena = " +  mysql.escape(contrasena)+""
            console.log(sql);
         /********************* Login area *********************/
            connection.query(sql, function(error, usuario) {
                if (error) return res.status(500).send("Error obteniendo usuarios");
                userId = usuario;
               
                if (usuario.length == 0 ){
                    return res.status(401).send("Error usuarios o contraseña");
                }
                var payload = {
                    iss: userId,
                    exp: Date.now() + expire
                };
                var token = jwt.encode(payload, secretKey, algorithm);
                console.log('Token ' + token);
                res.status(200).json(token);
            });
       });

        /********************* Control de usuario *********************/
        app.get("/api/v1/login", cors(corsOptions), function(req, res) {
            connection.query("SELECT * FROM usuario", function(error, usuario) {
                if (error) return res.status(500).send("Error obteniendo usuarios");
                res.status(200).json(usuario);
            });
        });

        // /api/v1/login/:email
        app.get("/api/v1/login/:email", cors(corsOptions), function(req, res) {
            var email = parseInt(req.params.email);
            connection.query("SELECT * FROM usuario as usu WHERE usu.email = ?", [email], function(error, usuario) {
                if (error){
                    console.log(error);
                    return res.status(500).send("Error obteniendo usuario");
                } 
                
                if (usuario.length == 0) return res.status(404).send("Error. usuario no encontrado");
                res.status(200).json(usuario);
            });
        });

     /********************************* BANCO AREA **********************************/
        app.post("/api/v1/bank", cors(corsOptions), function(req, res) {
            console.log(req.body);
            var email = req.body.cuenta;
            var contrasena = req.body.contrasena;
            var sql = "SELECT usu.id FROM banco as usu Where usu.email = " + mysql.escape(email) +  " and usu.contrasena = " +  mysql.escape(contrasena)+""
            console.log(sql);
            /********************* VERIFICACION USUARIO BANCO *********************/
            connection.query(sql, function(error, banco) {
                if (error) return res.status(500).send("Error obteniendo cuenta");
                cuentaId = banco;

                if (datoscuenta.length == 0 ){
                    return res.status(401).send("Error usuarios o contraseña");
                }
                var payload = {
                    iss: cuentaId,
                    exp: Date.now() + expire
                };
                var token2 = jwt.encode(payload, secretKey, algorithm);
                console.log('Token ' + token2);
                res.status(200).json(token2);
            });
        });

        /********************* Control de cuenta *********************/
        app.get("/api/v1/bank", cors(corsOptions), function(req, res) {
            connection.query("SELECT * FROM banco", function(error, cuenta) {
                if (error) return res.status(500).send("Error obteniendo cuentas");
                res.status(200).json(cuenta);
            });
        });
 
        app.put("/api/v1/bank", cors(corsOptions), function(req, res) {
            console.log(req.body);
            var id = req.body.id;
            var saldo = req.body.saldo;
            var sql = "UPDATE banco SET saldo = " + mysql.escape(saldo) + " WHERE (id = " + mysql.escape(id) + ");"
            console.log(sql);
            // "UPDATE `ass`.`banco` SET `saldo` = '1500' WHERE (`id` = '1');"
            // "SELECT usu.id FROM banco as usu Where usu.email = " + mysql.escape(email) +  " and usu.contrasena = " +  mysql.escape(contrasena)+""
            connection.query(sql, function(error, cuenta) {
                if (error) return res.status(500).send("Error actualizando cuentas");
                res.status(200).json(cuenta);
            });
        });

    /********************* Mostra Catalogo *********************/
    app.get("/api/v1/catalogo", cors(corsOptions), function(req, res) {
        connection.query("SELECT * FROM catalogo", function(error, catalogo) {
            if (error) return res.status(500).send("Error obteniendo productos");
            res.status(200).json(catalogo);
        });
    });

   /********************* Actualiza STOCK *********************/
    app.put("/api/v1/catalogo", cors(corsOptions), function(req, res) {
        console.log(req.body);
        var producto = req.body.producto;
        var stock = req.body.stock;
        var sql = "UPDATE catalogo SET stock = stock +" + mysql.escape(stock) + " WHERE (producto = " + mysql.escape(producto) + ");"

        console.log(sql);
        connection.query(sql, function(error, catalogo) {
            if (error) return res.status(500).send("Error obteniendo productos");
            res.status(200).json(catalogo);
        });
    });

    /********************* Control de Pedidos *********************/
    app.get("/api/v1/pedidos", cors(corsOptions), function(req, res) {
        connection.query("SELECT * FROM pedidos", function(error, catalogo) {
            if (error) return res.status(500).send("Error obteniendo productos");
            res.status(200).json(catalogo);
        });
    }); 
    app.get("/api/v1/pedidos/:pedido", cors(corsOptions), function(req, res) {
        var pedido = parseInt(req.params.pedido);
        connection.query("SELECT * FROM pedidos WHERE numero = ?", [pedido], function(error, pedido) {
            if (error){
                console.log(error);
                return res.status(500).send("Error obteniendo numero de pedido");
            } 
            if (pedido.length == 0) return res.status(404).send("Error. pedido no encontrado");
            res.status(200).json(pedido);
        });
    });
    
    app.post("/api/v1/pedidos", cors(corsOptions), function(req, res) {
        console.log(req.body);
        var idPedidos = req.body.idPedidos;
        var numero = req.body.numero;
        var producto = req.body.producto;
        var precio =  req.body.precio;
        var cantidad = req.body.cantidad;
        var entrega = req.body.entrega;
        var total = req.body.total;
        var pago = req.body.pago;
        var totalFactura = req.body.totalFactura;
        var usuario = req.body.usuario;
        var sql = "INSERT INTO pedidos (numero , producto, precio, cantidad, total, pago, entrega, totalFactura, usuario) VALUES (" + mysql.escape(numero) + "," + mysql.escape(producto) + "," + mysql.escape(precio) + "," + mysql.escape(cantidad) + "," + mysql.escape(total) + "," + mysql.escape(pago) + "," + mysql.escape(entrega) + "," + mysql.escape(totalFactura) + "," + mysql.escape(usuario) + ");"
        
        connection.query(sql, function(error, pedidos) {
            console.log(error);
            if (error) return res.status(500).send("Error insertar pedido");
            res.status(200).json(pedidos);
        });
    });


    app.put("/api/v1/pedidos", cors(corsOptions), function(req, res) {
        console.log(req.body);
        var numero = req.body.numero;
        var pago = req.body.pago;
        var sql = "UPDATE pedidos SET pago = " + mysql.escape(pago) + " WHERE (numero = " + mysql.escape(numero) + ");"
   
        console.log(sql);
        connection.query(sql, function(error, catalogo) {
            if (error) return res.status(500).send("Error obteniendo productos");
            res.status(200).json(catalogo);
        });
    });

     /********************* SOPA :-Pueba *********************/ 

    app.get("/api/v1/converter/:temp", cors(corsOptions), function(req, res) {
        console.log(req.params.temp);
        var args = {celsius: req.params.temp};
        soap.createClient(url, function(err, client) {
            client.celsiusToFarenheit(args, function(error, result) {
                console.log(result);
                if (error) return res.status(500).send("Error obteniendo datos");
                res.status(200).json(result);
            });
        });
    });
    /********************* SOAP Almacenes *********************/ 
    app.get("/api/v1/almacen/:producto", cors(corsOptions), function(req, res) {
        console.log(req.params.producto);
        var args = {producto: req.params.producto};
        soap.createClient(urlAlmacen, function(err, client) {
            client.ComprobarStock(args, function(error, result) {
                console.log(result);
                if (error) return res.status(500).send("Error obteniendo datos");
                res.status(200).json(result);
            });
        });
    });
    /********************* SOAP Gestion de proveedores *********************/ 
    app.get("/api/v1/proveedor1/:producto", cors(corsOptions), function(req, res) {
        console.log(req.params.producto);
        var args = {producto: req.params.producto};
        soap.createClient(urlProv1, function(err, client,) {
            client.SolicitarPersupuesto(args, function(error, result1) {
                if (error) return res.status(500).send("Error obteniendo datos WSDL Proveedor1");
                    res.status(200).json(result1.return);         
            });
        });
    });
    app.get("/api/v1/proveedor2/:producto", cors(corsOptions), function(req, res) {
        var args = {producto: req.params.producto};
        soap.createClient(urlProv2, function(err, client) {
            client.SolicitarPersupuesto(args, function(error, result2) {
                if (error) return res.status(500).send("Error obteniendo datos WSDL Proveedor2");
                res.status(200).json(result2.return); 
            });
        });
    });
    app.get("/api/v1/orden1/:producto", cors(corsOptions), function(req, res) {
        var args = {producto: req.params.producto};
        soap.createClient(urlProv1, function(err, client) {
            client.OrdenarCompra(args, function(error, resultmenor1) {
                console.log(resultmenor1);
                console.log('en proveedor 1');
                if (error) return res.status(500).send("Error obteniendo datos de la solicitud de compra");
                res.status(200).json(resultmenor1);
            });
        });
    });         
    app.get("/api/v1/orden2/:producto", cors(corsOptions), function(req, res) {
        var args = {producto: req.params.producto};
        soap.createClient(urlProv2, function(err, client) {
            client.OrdenarCompra(args, function(error, resultmenor2) {
                console.log(resultmenor2);
                console.log('en proveedor 2');
                if (error) return res.status(500).send("Error obteniendo datos de la solicitud de compra");
                res.status(200).json(resultmenor2);
            });
        });           
    });
    app.get("/api/v1/ode/:producto", cors(corsOptions), function(req, res) {
        console.log(req.params.producto);
        var args = {producto: req.params.producto};
        soap.createClient(urlCompleto, function(err, client,) {
            client.SolicitarPersupuesto(args, function(error, result) {
          //  client.ProyectoBPELMasterRequest(args, function(error, result) {
                if (error) return res.status(500).send("Error obteniendo datos WSDL ODE");
                if (result.return) {
                    client.OrdenarCompra(args, function(error, result1) {
                        if (error) return res.status(500).send("Error obteniendo datos WSDL ODE");
                            res.status(200).json(1);         
                });
                } else res.status(200).json(0);       
            });
           // 
         /*   client.OrdenarCompra(args, function(error, result1) {
                    if (error) return res.status(500).send("Error obteniendo datos WSDL ODE");
                        res.status(200).json(result1);         
            }); */
             
        });
    });
    /********************* Config API *********************/
    app.use(cors())
    app.use("/api/v1/", function(req, res, next) { // dentro del API
        var token = res.headers['authorization'];
        if (!token) {
            res.status(403).json('missing token');
            console.error("No se ha indicado token");
            return
        }
        console.log("Ok");
        res.send("Ok. " + req.method + " " + req.url);

        // Descodificamos el token para que nos devuelva el usuario y la fecha de expiración
        var payload = jwt.decode(token, secretKey, algorithm);
        if (!payload || !payload.iss || !payload.exp) {
            console.error("Token error");
            return res.status(403).json("Token error");
        }

        // Comprobamos la fecha de expiración
        if (Date.now() > payload.exp) {
            console.error("Expired token");
            return res.status(403).json("Expired token");
        }

        // Añadimos el usuario a req para acceder posteriormente.
        req.user = payload.iss;
        next(); // todo ok, continuar
        
    });

    // Iniciar app
        var port = 3000;
        app.listen(port, function() {
            console.log("Servidor escuchando en puerto:", port);
        });

    }, function(err) { // se ha producido un error cargando el RAML
        console.log("Error cargando RAML: " + JSON.stringify(err));
    });
});
