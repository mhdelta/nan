app = angular.module("LecterApp");

app.controller("ConsultasController", ConsultasController);
function ConsultasController($scope, $http, $q) {
    var vm = this;

    //Variables
    vm.labelsHelados = [];
    vm.datosHelados = [];

    vm.datosCerveza = [];
    vm.preciosCerveza = [];

    //Métodos
    vm.inictr = Inictr;
    vm.traerInventario = TraerInventario;
    vm.traerInventarioServ = TraerInventarioServ;
    vm.cargarTabla = CargarTabla;
    vm.inictr();


    function Inictr() {
        try {
            vm.traerInventario();
        } catch (error) {
            console.log(error);
        }
    }

    function CargarTabla() {
        vm.cth = document.getElementById("chartHelados");

        vm.helados = new Chart(vm.cth, {
            type: 'bar',
            data: {
                labels: vm.labelsHelados,
                datasets: [{
                    label: '# de helados',
                    data: vm.datosHelados,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        vm.ctc = document.getElementById("chartCerveza");

        vm.cervezas = new Chart(vm.ctc, {
            type: 'bar',
            data: {
                labels: vm.preciosCerveza,
                datasets: [{
                    label: '# de cerveza',
                    data: vm.datosCerveza,
                    backgroundColor: [
                        'rgba(60,255,132, 0.2)',
                        'rgba(54, 162, 100, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(60,255,132,1)',
                        'rgba(54, 162, 100, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Precio de compra'
                        }
                    }]
                }
            }
        });
    }

    function TraerInventario() {
        try {
            vm.traerInventarioServ()
                .then(function (response) {
                    if (response.status == 201) {
                        console.log("Se inicializó el inventario");
                        response.data.forEach(function (elm) {
                            if (elm.sabor != null) {
                                var saborCategoria = elm.sabor + ' ' + elm.categoria;
                                vm.labelsHelados.push(saborCategoria);
                                vm.datosHelados.push(elm.cantidad);
                            } else {
                                vm.preciosCerveza.push('$' + elm.precio.toString());
                                vm.datosCerveza.push(elm.cantidad);
                            }
                        });
                        console.log(vm.datosCerveza);
                        vm.cargarTabla();
                    } else {
                        swal('Oops...', 'No se pudieron traer los datos del inventario!', 'error');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    }

    function TraerInventarioServ() {
        try {
            return ConsumeServicePromise($q, $http, "/traer_inventario");
        } catch (error) {
            console.log(error);

            throw (error, "no es posible traer el inventario");
        }
    }

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

