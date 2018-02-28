app = angular.module("LecterApp");

app.controller("VentaController", VentaController);
function VentaController($scope, $http, $q){
    $scope.$on("$destroy", function () {
        vm = null;
        delete $scope.vm;
    });
    var vm = this;

    //Variables
    vm.venta = {
        CANTIDAD: null,
        SABOR: null,
        PRECIO_VENTA: null,
        FECHA_VENTA: null,
        CLIENTE: null
    };
    vm.submit = false;
    // En una futura actualización la variable 
    // vm.sabores se llenará automaticamente con
    // información proveniente del servidor
    vm.sabores = [
        {
            'key': 0,
            'value': 'COCO'
        },
        {
            'key': 1,
            'value': 'CHOCOLATE'
        },
        {
            'key': 2,
            'value': 'MARACUYA'
        },
        {
            'key': 3,
            'value': 'AREQUIPE'
        },
        {
            'key': 4,
            'value': 'VAINILLA'
        },
        {
            'key': 5,
            'value': 'COOKIES AND CREAM'
        },
        {
            'key': 7,
            'value': 'MORA'
        },
        {
            'key': 8,
            'value': 'RON CON PASAS'
        },
        {
            'key': 9,
            'value': 'QUESO Y BOCADILLO'
        }
    ];
    vm.selected;

    vm.clientes = [
        {
            'key': 0,
            'value': 'LATINO SPORT'
        },
        {
            'key': 1,
            'value': 'EL DIAMANTE'
        },
        {
            'key': 2,
            'value': 'SOCRATES VALENCIA'
        },
        {
            'key': 3,
            'value': 'HERBALIFE'
        },
        {
            'key': 4,
            'value': 'BOCA JUNIOR'
        },
        {
            'key': 5,
            'value': 'COMFAMILIAR'
        },
        {
            'key': 7,
            'value': 'DEPORTIVO PEREIRA'
        }
    ];
    vm.selected2;
    //Métodos

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
            vm.venta.FECHA_VENTA = d.getDate().toString() + "/" + d.getMonth().toString() + "/" + d.getFullYear().toString();
            switch (producto) {
                case "helado":
                    vm.venta.SABOR = vm.selected.value;
                    vm.venta.CLIENTE = vm.selected2.value;
                    vm.RegistrarVentaHeladosBD(vm.venta)
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

                case "cerveza":
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
    /**
     * @description Limpia las propiedades del view model
     * @author Miguel Ángel Henao Pérez
     * @return {void}
     */
    function Clean() {
        vm.venta.CANTIDAD = null;
        vm.venta.SABOR = null;
        vm.venta.PRECIO_VENTA = null;
        vm.venta.FECHA_VENTA = null;
        vm.selected = null;
    }
}

