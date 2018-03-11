app = angular.module("LecterApp");

app.controller("VentaController", VentaController);
function VentaController($scope, $http, $q) {
    $scope.$on("$destroy", function () {
        vm = null;
        delete $scope.vm;
    });
    var vm = this;

    //Variables
    vm.venta = {
        cantidad: null,
        sabor: null,
        precio_venta: null,
        fecha_venta: null,
        cliente: null
    };
    vm.submit = false;
    // En una futura actualización la variable 
    // vm.sabores se llenará automaticamente con
    // información proveniente del servidor
    vm.sabores;
    vm.selected;

    vm.clientes;
    vm.selected2;
    //Métodos
    vm.agregarCliente = AgregarCliente;
    vm.agregarClienteBD = AgregarClienteBD;
    vm.inicializarClientes = InicializarClientes;
    vm.inicializarSabores = InicializarSabores;
    vm.traerSabores = TraerSabores;
    vm.traerClientes = TraerClientes;
    vm.RegistrarVenta = RegistrarVenta;
    vm.inictr = Inictr;
    vm.RegistrarVentaHeladosBD = RegistrarVentaHeladosBD;
    vm.RegistrarVentaCervezaBD = RegistrarVentaCervezaBD;
    vm.ConsumeServicePromise = ConsumeServicePromise;
    vm.clean = Clean;



    vm.inictr();
    /**
     * @description Da inicio al controlador
     * @author Miguel Ángel Henao Pérez
     * @return {void}
     */
    function Inictr() {
        try {
            vm.inicializarClientes();
            vm.inicializarSabores();
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * @description Envia la peticion al back con la compra a realizar, 
     * los datos de la compra son sabor, cantidad, precio_VENTA/unidad y la fecha
     * @author Miguel Ángel Henao Pérez
     * @return {void}
     */
    function RegistrarVenta(producto) {
        try {
            // La fecha debe de ser formateada para que el SQL la entienda
            var d = new Date();
            vm.venta.fecha_venta = d.getDate().toString() + "/" + d.getMonth().toString() + "/" + d.getFullYear().toString();
            switch (producto) {
                case "helado":
                    vm.venta.sabor = vm.selected.sabor.sabor;
                    vm.venta.cliente = vm.selected.cliente;
                    var listaClientes = vm.selected.cliente.map(a => a.cliente);
                    vm.venta.cliente = listaClientes;
                    vm.venta.type = "helado";
                    vm.RegistrarVentaHeladosBD(vm.venta)
                        .then(function (response) {
                            if (response.status == 201) {
                                swal('Bien..!', 'Los datos se guardaron satisfactoriamente!', 'success');
                                vm.clean();
                            } else if (response.status == 203) {
                                swal('Oops...', 'No existe tal cantidad en el inventario. \n Existencias insuficientes', 'error');                                
                            } else {
                                swal('Oops...', 'No se guardaron los datos!', 'error');
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    break;

                case "cerveza":
                    delete vm.compra.sabor;
                    vm.RegistrarVentaCervezaBD(vm.venta)
                        .then(function (response) {
                            if (response.status == 201) {
                                swal('Bien..!', 'Los datos se guardaron satisfactoriamente!', 'success');
                                vm.clean();
                            } else {
                                swal('Oops...', 'No se guardaron los datos!', 'error');
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(error);

        }
    }
    /**
     * @description Devuelve una promesa con la respuesta del 
     * servidor al envio de la compra
     * @author Miguel Ángel Henao Pérez
     * @param  {any} data 
     * @return promise
     */
    function RegistrarVentaHeladosBD(data) {
        try {
            return vm.ConsumeServicePromise($q, $http, "/registrar_venta_helado", data);
        } catch (error) {
            new UserException(error, "no es posible anadir la venta");
        }
    }

    function RegistrarVentaCervezaBD(data) {
        try {
            return vm.ConsumeServicePromise($q, $http, "/registrar_venta_cerveza", data);
        } catch (error) {
            new UserException(error, "no es posible anadir la venta");
        }
    }

    /**
     * @description Consume un servicio para devolver una promesa
     * @author Miguel Ángel Henao Pérez
     * @param  {any} $q 
     * @param  {any} http 
     * @param  {any} Url 
     * @param  {string} [data=""] 
     * @param  {string} [contentType="application/json"] 
     * @param  {string} [method="POST"] 
     * @return 
     */
    function ConsumeServicePromise($q, http, Url, data = "", contentType = "application/json", method = "POST") {
        try {
            var defered = $q.defer();
            var promise = defered.promise;

            var config = {
                "async": true,
                "crossDomain": true,
                "method": method,
                "url": Url,
                "headers": {
                    'Content-Type': contentType,
                    'cache-control': 'no-cache',
                    'Access-Control-Allow-Origin': '*'
                },
                "data": data,
                "processData": false
            };
            http(config).then(
                function (data) {
                    defered.resolve(data);
                },
                function (err) {
                    defered.reject(err);
                }
            );

            return promise;
        } catch (e) {
            console.log(e);
        }
    }

    function AgregarCliente() {
        try {
            bootbox.prompt("Nombre del nuevo Cliente", function (result) {
                if (result) {
                    data = {}
                    data.cliente = result.toLowerCase();
                    vm.agregarClienteBD(data)
                        .then(function (response) {
                            if (response.status == 201) {
                                swal({
                                    title: "Bien !",
                                    text: "Se agrego el cliente con éxito!",
                                    type: "success"
                                });
                                vm.inicializarClientes();
                            }
                            else {
                                if (response.status == 202) {
                                    swal('Oops...', 'El cliente ya existe, prueba con otro!', 'error');
                                } else {
                                    swal('Oops...', 'Ocurrió un error agregando el cliente', 'error');
                                }

                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

    function AgregarClienteBD(data) {
        try {
            return vm.ConsumeServicePromise($q, $http, "/agregar_cliente", data);
        } catch (error) {
            new UserException(error, "no es posible agregar el cliente");
        }
    }

    function InicializarClientes() {
        try {
            vm.traerClientes()
                .then(function (response) {
                    if (response.status == 201) {
                        console.log("Se inicializaron los clientes");
                        vm.clientes = response.data;
                    } else {
                        swal('Oops...', 'No se guardaron los datos!', 'error');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error)
        }
    }

    function InicializarSabores() {
        try {
            vm.traerSabores()
                .then(function (response) {
                    if (response.status == 201) {
                        console.log("Se inicializaron los sabores");
                        vm.sabores = response.data;
                    } else {
                        swal('Oops...', 'No se guardaron los datos!', 'error');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error)
        }
    }

    /**
 * @description Devuelve una promesa con la respuesta del 
 * servidor al envio de la compra
 * @author Miguel Ángel Henao Pérez
 * @return promise
 */
    function TraerSabores() {
        try {
            return vm.ConsumeServicePromise($q, $http, "/inicializar_sabores");
        } catch (error) {
            new UserException(error, "no es posible inicializar los sabores");
        }
    }


    /**
 * @description Devuelve una promesa con la respuesta del 
 * servidor al envio de la compra
 * @author Miguel Ángel Henao Pérez
 * @return promise
 */
    function TraerClientes() {
        try {
            return vm.ConsumeServicePromise($q, $http, "/inicializar_clientes");
        } catch (error) {
            new UserException(error, "no es posible inicializar los clientes");
        }
    }

    /**
     * @description Limpia las propiedades del view model
     * @author Miguel Ángel Henao Pérez
     * @return {void}
     */
    function Clean() {
        vm.venta.cantidad = null;
        vm.venta.sabor = null;
        vm.venta.precio_venta = null;
        vm.venta.fecha_venta = null;
        vm.selected = null;
        vm.selected2 = null;
    }
}

