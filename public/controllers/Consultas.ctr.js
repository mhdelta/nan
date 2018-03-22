app = angular.module("LecterApp");

app.controller("ConsultasController", ConsultasController);
function ConsultasController($scope, $http, $q) {
    var vm = this;

    //Variables
    vm.labelsHelados = [];
    vm.datosHelados = [];

    vm.datosCerveza = [];
    vm.preciosCerveza = [];

    vm.labelsVentas = [];
    vm.datosVentas = [];

    vm.valorCostoHelados = 0;
    vm.valorCostoCerveza = 0;


    //Métodos
    vm.traerVentas = TraerVentas;
    vm.traerVentasServ = TraerVentasServ;

    vm.traerInventario = TraerInventario;
    vm.traerInventarioServ = TraerInventarioServ;

    vm.cargarTablasInv = CargarTablasInv;

    vm.inictr = Inictr;
    vm.inictr();


    function Inictr() {
        try {
            vm.traerInventario();
            vm.traerVentas();
        } catch (error) {
            console.log(error);
        }
    }

    function CargarTablasInv() {
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
                            // console.log(elm);
                            
                            if (elm.sabor != null) {
                                var saborCategoria = elm.sabor + ' ' + elm.categoria;
                                vm.labelsHelados.push(saborCategoria);
                                vm.datosHelados.push(elm.cantidad);
                                vm.valorCostoHelados += elm.cantidad * elm.precio;
                            } else {
                                vm.preciosCerveza.push('$' + elm.precio.toString());
                                vm.datosCerveza.push(elm.cantidad);
                                vm.valorCostoCerveza += elm.cantidad * elm.precio;
                                
                            }
                        });
                        vm.valorCostoHelados = (vm.valorCostoHelados + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                        vm.valorCostoCerveza = (vm.valorCostoCerveza + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                        vm.cargarTablasInv();
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

    function TraerVentas() {
        try {
            vm.traerVentasServ()
                .then(function (response) {
                    if (response.status == 201) {
                        console.log("Se trajeron las ventas");
                        response.data.forEach(function (elm) {
                            vm.datosVentas.push(elm);
                        });
                        console.log(vm.datosVentas);
                        vm.cargarTablasInv();
                    } else {
                        swal('Oops...', 'No se pudieron traer los datos de las ventas!', 'error');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    }

    function TraerVentasServ() {
        try {
            return ConsumeServicePromise($q, $http, "/traer_ventas");
        } catch (error) {
            console.log(error);

            throw (error, "no es posible traer las ventas");
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

