app = angular.module("LecterApp");

app.controller("PrediccionesController", PrediccionesController);
function PrediccionesController($scope, $http, $q) {
  var vm = this;

  //Variables
  vm.clientes;
  vm.selected;
  //Métodos

  vm.traerClientes = TraerClientes;
  vm.inicializarClientes = InicializarClientes;
  vm.predecir = Predecir;

  vm.inictr = Inictr;
  vm.inictr();

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
}
