app = angular.module("LecterApp");

app.controller("PrediccionesController", PrediccionesController);
function PrediccionesController($scope, $http, $q) {
  var vm = this;
//=================================================================
  //Variables
  vm.clientes;
  vm.selected;
//=================================================================
  //Métodos
  vm.traerClientes = TraerClientes;
  vm.inicializarClientes = InicializarClientes;
  vm.predecir = Predecir;
  vm.cargarTablasPredicciones = CargarTablasPredicciones;
  vm.inictr = Inictr;
  vm.inictr();
//=================================================================
/**
 * @description Da inicio al controlador, la acción inmediata es 
 *              Traer los   
 * @author Miguel Ángel Henao Pérez
 * @return {void}
 */
function Inictr() {
    try {
      vm.inicializarClientes();

      //  La informacion que irá en la data se saca de una forma en el que el usuairo pueda seleccionar dos
      // y solamente dos usuarios

      // Esta lista se obtiene de un input de dos equipos en la vista
      // cuando se tengan los dos equipos se envian como parámetros en un objeto con el
      // atributo clientes
    } catch (error) {
      console.log(error);
    }
  }

  function Predecir() {
    // Array con los do equipos que van a disputar la semana siguiente
    var data = vm.selected.cliente.map(a => a.cliente);
    if (data.length < 2) {
      swal(
        "Oops...",
        "Es necesario seleccionar al dos equipos para realizar la predicción",
        "error"
      );
    } else {
      try {
        ConsumeServicePromise($q, $http, "/predicciones", data)
          .then(function(response) {
            if (response.status == 201) {
			  vm.labelsSabores = [];
			  vm.prediccion = [];
              response.data.forEach(function(elm) {
                vm.labelsSabores.push(elm._id.sabor + " " + elm._id.tamano);
                vm.prediccion.push(elm.promedio_vendido);
              });
              vm.cargarTablasPredicciones();
            } else {
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  function ConsumeServicePromise(
    $q,
    http,
    Url,
    data = "",
    contentType = "application/json",
    method = "POST"
  ) {
    try {
      var defered = $q.defer();
      var promise = defered.promise;

      var config = {
        async: true,
        crossDomain: true,
        method: method,
        url: Url,
        headers: {
          "Content-Type": contentType,
          "cache-control": "no-cache",
          "Access-Control-Allow-Origin": "*"
        },
        data: data,
        processData: false
      };
      http(config).then(
        function(data) {
          defered.resolve(data);
        },
        function(err) {
          defered.reject(err);
        }
      );

      return promise;
    } catch (e) {
      console.log(e);
    }
  }

  function TraerClientes() {
    try {
      return ConsumeServicePromise($q, $http, "/inicializar_clientes");
    } catch (error) {
      console.log(error, "no es posible inicializar los clientes");
    }
  }

  function InicializarClientes() {
    try {
      vm
        .traerClientes()
        .then(function(response) {
          if (response.status == 201) {
            console.log("Se inicializaron los clientes");
            vm.clientes = response.data;
          } else {
            swal("Oops...", "No se guardaron los datos!", "error");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function CargarTablasPredicciones () {
	  try {
		vm.ctp = document.getElementById("chartPred");
        vm.pred = new Chart(vm.ctp, {
            type: 'bar',
            data: {
                labels: vm.labelsSabores,
                datasets: [{
                    label: "Cantidad probable de helados a ser vendida ",
                    data: vm.prediccion,
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
                    ]
                }
                ]
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
	  } catch (error) {
		  console.log(error);
	  }
  }
}

