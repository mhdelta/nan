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
        PRECIO_UNITARIO: null
    };

    //Métodos

    vm.RegistrarCompra = RegistrarCompra;
    vm.inictr = Inictr;
    vm.RegistrarCompraBD = RegistrarCompraBD;
    vm.ConsumeServicePromise = ConsumeServicePromise;



    vm.inictr();

    function Inictr() {
        try {

        } catch (error) {
            console.log(error);

        }
    }

    function RegistrarCompra() {
        try {
            vm.RegistrarCompraBD(vm.compra)
                .then(function (response) {
                    if (response.status == 200) {
                        alert("Se guardaron los datos con éxito");
                    } else {
                        alert("No se guardaron los datos con éxito");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);

        }
    }

    function RegistrarCompraBD(data){
        try {
            return vm.ConsumeServicePromise($q, $http, "/registrarCompra", data);
        } catch (error) {
            new UserException(error, "no es posible anadir la compra");
        }
    }

            /**
 * Consume un servicio del api y devuelve una promesa
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
}

