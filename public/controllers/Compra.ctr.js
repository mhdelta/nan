app = angular.module("LecterApp");

app.controller("CompraController", CompraController);
function CompraController($scope, $http, $q) {

    $scope.$on("$destroy", function () {
        vm = null;
        delete $scope.vm;
    });
    var vm = this;

    //Variables
    vm.compra = {
        cantidad: null,
        sabor: null,
        precio_unitario: null,
        fecha: null
    };
    vm.submit = false;
    vm.sabores;
    vm.selected;
    //Métodos

    vm.agregarSabor = AgregarSabor;
    vm.agregarSaborBD = AgregarSaborBD;
    vm.RegistrarCompra = RegistrarCompra;
    vm.inictr = Inictr;
    vm.inicializarSabores = InicializarSabores;
    vm.traerSabores = TraerSabores;
    vm.RegistrarCompraHeladosBD = RegistrarCompraHeladosBD;
    vm.RegistrarCompraCervezaBD = RegistrarCompraCervezaBD;
    vm.ConsumeServicePromise = ConsumeServicePromise;
    vm.tooBig = TooBig;
    vm.clean = Clean;



    vm.inictr();
    /**
     * @description Da inicio al controlador
     * @author Miguel Ángel Henao Pérez
     * @return {void}
     */
    function Inictr() {
        try {
            vm.inicializarSabores();
        } catch (error) {
            console.log(error);

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

    function AgregarSabor() {
        try {
            bootbox.prompt("Nombre del nuevo sabor", function (result) {
                if (result) {
                    data = {}
                    data.sabor = result.toLowerCase();
                    vm.agregarSaborBD(data)
                        .then(function (response) {
                            if (response.status == 201) {
                                swal({
                                    title: "Bien !",
                                    text: "Se agrego el sabor con éxito!",
                                    type: "success"
                                });
                                vm.inicializarSabores();
                            }
                            else {
                                if (response.status == 202) {
                                    swal('Oops...', 'El sabor ya existe, prueba con otro!', 'error');
                                } else {
                                    swal('Oops...', 'Ocurrió un error agregando el sabor', 'error');
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

    /**
     * @description Envia la peticion al back con la compra a realizar, 
     * los datos de la compra son sabor, cantidad, precio/unidad y la fecha
     * @author Miguel Ángel Henao Pérez
     * @return {void}
     */
    function RegistrarCompra(producto) {
        try {
            // La fecha debe de ser formateada para que el SQL la entienda
            var d = new Date();
            vm.compra.fecha = d.getDate().toString() + "/" + d.getMonth().toString() + "/" + d.getFullYear().toString();
            vm.compra.precio_unitario = parseInt(vm.compra.precio_unitario);
            vm.tooBig();
            if (!vm.validSize) {
                return;
            }
            switch (producto) {
                case "helado":
                    vm.compra.sabor = vm.selected.sabor.sabor;
                    vm.RegistrarCompraHeladosBD(vm.compra)
                        .then(function (response) {
                            if (response.status == 201) {
                                swal('Bien..!', 'Los datos se guardaron satisfactoriamente!', 'success');
                                console.log(response.data);
                                vm.clean();
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
                    vm.RegistrarCompraCervezaBD(vm.compra)
                        .then(function (response) {
                            if (response.status == 201) {
                                swal('Bien..!', 'Los datos se guardaron satisfactoriamente!', 'success');
                                console.log(response.data);
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

    function TooBig() {
        vm.validSize = true;
        if (vm.compra.cantidad > 100000 || vm.compra.cantidad<1) {
            swal('Oops...', 'Nahh, La cantidad no es válida', 'error');
            vm.validSize = false;
        }
        if(vm.compra.precio_unitario > 100000 || vm.compra.precio_unitario < 1){
            swal('Oops...', 'Nahh, El precio no es válido', 'error');
            vm.validSize = false;
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
     * @param  {any} data 
     * @return promise
     */
    function RegistrarCompraHeladosBD(data) {
        try {
            return vm.ConsumeServicePromise($q, $http, "/registrar_compra_helado", data);
        } catch (error) {
            new UserException(error, "no es posible anadir la compra");
        }
    }

    function RegistrarCompraCervezaBD(data) {
        try {
            return vm.ConsumeServicePromise($q, $http, "/registrar_compra_cerveza", data);
        } catch (error) {
            new UserException(error, "no es posible anadir la compra");
        }
    }

    function AgregarSaborBD(data) {
        try {
            return vm.ConsumeServicePromise($q, $http, "/agregar_sabor", data);
        } catch (error) {
            new UserException(error, "no es posible agregar el sabor");
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
    /**
     * @description Limpia las propiedades del view model
     * @author Miguel Ángel Henao Pérez
     * @return {void}
     */
    function Clean() {
        vm.compra.cantidad = null;
        vm.compra.sabor = null;
        vm.compra.precio_unitario = null;
        vm.compra.fecha = null;
        vm.selected = null;
    }
}

