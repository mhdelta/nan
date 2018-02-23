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
        CANTIDAD: null,
        SABOR: null,
        PRECIO_UNITARIO: null,
        FECHA: null
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
    //Métodos

    vm.RegistrarCompra = RegistrarCompra;
    vm.inictr = Inictr;
    vm.RegistrarCompraHeladosBD = RegistrarCompraHeladosBD;
    vm.RegistrarCompraCervezaBD = RegistrarCompraCervezaBD;
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
     * los datos de la compra son sabor, cantidad, precio/unidad y la fecha
     * @author Miguel Ángel Henao Pérez
     * @return {void}
     */
    function RegistrarCompra(producto) {
        try {
            // La fecha debe de ser formateada para que el SQL la entienda
            var d = new Date();
            vm.compra.FECHA = d.getDate().toString() + "/" + d.getMonth().toString() + "/" + d.getFullYear().toString();
            switch (producto) {
                case "helado":
                    vm.compra.SABOR = vm.selected.value;
                    vm.RegistrarCompraHeladosBD(vm.compra)
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
                    vm.RegistrarCompraCervezaBD(vm.compra)
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
        vm.compra.CANTIDAD = null;
        vm.compra.SABOR = null;
        vm.compra.PRECIO_UNITARIO = null;
        vm.compra.FECHA = null;
        vm.selected = null;
    }
}

