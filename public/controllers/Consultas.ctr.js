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

    vm.datosCantProds = [];
    vm.labelCantProds = [];


    //Métodos
    vm.traerVentas = TraerVentas;

    vm.traerInventario = TraerInventario;

    vm.cargarTablasInv = CargarTablasInv;
    vm.cargarTablasVentas = CargarTablasVentas;
    vm.cargarTablasClientes = CargarTablasClientes;
    vm.cargarTablasVentasMensuales = CargarTablasVentasMensuales;
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
            type: 'pie',
            data: {
                labels: vm.labelsHelados,
                datasets: [{
                    label: '# de helados',
                    data: vm.datosHelados,
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgb(18.8%, 70.6%, 7.7%)',
                        'rgb(64, 39, 190)',
                        'rgb(90, 98, 13)',
                        'rgb(214, 20, 194)',
                        'rgb(216, 20, 49)',
                        'rgba(255, 206, 86, 1)',
                        'rgb(234, 105, 14)'
                    ],
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
            type: 'doughnut',
            data: {
                datasets: [{
                    label: '# de cerveza',
                    data: vm.datosCerveza,
                    backgroundColor: [
                        'rgb(60,255,132)',
                        'rgb(54, 162, 100)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)'
                    ]
                }],
                labels: vm.preciosCerveza,
            }
        });
    }

    function CargarTablasVentas() {
        vm.ctp = document.getElementById("chartProdMas");

        vm.helados = new Chart(vm.ctp, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Producto más vendido',
                    data: vm.datosCantProds,
                    backgroundColor: [
                        'rgb(38, 228, 15)',
                        'rgb(222, 20, 21)'
                    ]
                }],
                labels: vm.labelCantProds,
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
    }

    function CargarTablasVentasMensuales() {
        vm.ctm = document.getElementById("chartProdMensual");
        vm.helados = new Chart(vm.ctm, {
            type: 'bar',
            data: {
                labels: vm.fechaVentaMensual,
                datasets: [{
                    label: 'Total vendido en helados',
                    data: vm.totalVentaMensualHelados,
                    backgroundColor: [
                        'rgb(5.9%, 64%, 63.6%)',
                        'rgb(5.9%, 64%, 63.6%)',
                        'rgb(5.9%, 64%, 63.6%)',
                        'rgb(5.9%, 64%, 63.6%)',
                        'rgb(5.9%, 64%, 63.6%)',
                        'rgb(5.9%, 64%, 63.6%)',
                        'rgb(5.9%, 64%, 63.6%)',
                        'rgb(5.9%, 64%, 63.6%)',
                        'rgb(5.9%, 64%, 63.6%)'
                    ]
                },
                {
                    label: 'Total vendido en cervezas',
                    data: vm.totalVentaMensualCerveza,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 99, 132)',
                    ]
                }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                if (value - 50000 >= 0) {
                                    value = (value + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                                    return '$' + value;
                                }
                            }
                        },
                        stacked: true
                    }],
                    xAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    }

    function CargarTablasClientes() {
        vm.ctclientes = document.getElementById("RankingClientes");

        vm.clientes = new Chart(vm.ctclientes, {
            type: 'horizontalBar',
            data: {
                labels: vm.labelsClientes,
                datasets: [{
                    label: 'Total comprado',
                    data: vm.datosClientes,
                    backgroundColor: [
                        'rgb(5.9%, 64%, 63.6%)',
                        'rgb(8%, 62.8%, 12.5%)',
                        'rgb(55%, 69.8%, 7.3%)',
                        'rgb(88.2%, 41.4%, 7.9%)',
                        'rgb(82.7%, 12.2%, 12.2%)',
                        'rgb(79.2%, 10.1%, 76.8%)',
                        'rgb(20.8%, 7.5%, 77.3%)',
                        'rgb(70.1%, 66.3%, 85.9%)',
                        'rgb(85.9%, 66.3%, 85.2%)',
                        'rgb(66.3%, 85.9%, 69.3%)'
                    ]
                }]
            },
            options: {
                scales: {
                    yAxes: {},
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            stepSize: 20000,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                value = (value + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                                return '$' + value;
                            }
                        },
                    }]
                }
            }
        });
    }

    function TraerInventario() {
        try {
            ConsumeServicePromise($q, $http, "/traer_inventario")
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
                        vm.costoInventario = vm.valorCostoCerveza + vm.valorCostoHelados;
                        vm.costoInventario = (vm.costoInventario + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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

    function TraerVentas() {
        try {
            var prod;
            var prodMen;
            ConsumeServicePromise($q, $http, "/traer_ventas")
                .then(function (response) {
                    if (response.status == 201) {
                        prod = response.data[0];
                        prodMen = response.data[1];
                        vm.labelCantProds.push(prod._id.sabor + ' ' + prod._id.tamano);
                        vm.labelCantProds.push(prodMen._id.sabor + ' ' + prodMen._id.tamano);
                        console.log("Se trajeron las ventas");
                        vm.datosCantProds.push(prod.cantidad_vendida);
                        vm.datosCantProds.push(prodMen.cantidad_vendida);
                        vm.cargarTablasVentas();
                    } else {
                        swal('Oops...', 'No se pudieron traer los datos de las ventas!', 'error');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            ConsumeServicePromise($q, $http, "/traer_ventas_mensuales")
                .then(function (response) {
                    if (response.status == 201) {
                        vm.fechaVentaMensual = [];
                        vm.totalVentaMensualHelados = [];
                        vm.totalVentaMensualCerveza = [];
                        vm.totalVendidoMes = [];
                        response.data.forEach(function (elm) {
                            vm.fechaVentaMensual.push(elm._id.fecha);
                            vm.totalVendidoMes.push(elm._id.total_vendido);
                            if (elm._id.type == 'helado') {
                                vm.totalVentaMensualHelados.push(elm.total_vendido);
                            } else {
                                vm.totalVentaMensualCerveza.push(elm.total_vendido);
                            }
                        });
                        vm.cargarTablasVentasMensuales();
                    } else {
                        swal('Oops...', 'No se pudieron traer los datos de las ventas!', 'error');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            ConsumeServicePromise($q, $http, "/traer_clientes")
                .then(function (response) {
                    if (response.status == 201) {
                        vm.labelsClientes = [];
                        vm.datosClientes = [];
                        response.data.forEach(function (elm) {
                            vm.labelsClientes.push(elm._id);
                            vm.datosClientes.push(elm.total_comprado);
                        });
                        vm.cargarTablasClientes();
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

