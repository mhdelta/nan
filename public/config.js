app = angular.module("LecterApp");

app.config(configApp);
configApp.$inject = ['$routeProvider'];

function configApp($routeProvider) {
    $routeProvider

        .when("/", {
            controller: "MainController",
            templateUrl: "/public/views/main.view.html"
        })

        .when("/404", {
            templateUrl: "/public/views/404.view.html"
        })
        .when("/compra", {
            templateUrl: "/public/views/Compra.view.html",
            controllerAs: "vm"
        })
        .when("/compra-helados", {
            controller: "CompraController",
            templateUrl: "/public/views/CompraHelados.view.html",
            controllerAs: "vm"
                        
        })
        .when("/venta", {
            templateUrl: "/public/views/Venta.view.html",
            controllerAs: "vm"
        })
        .when("/venta-helados", {
            controller: "VentaController",
            controllerAs: "vm",            
            templateUrl: "/public/views/VentaHelados.view.html"            
        })
        .when("/info", {
            controllerAs: "vm",
            controller: "InfoController",
            templateUrl: "/public/views/Info.view.html"
        })
        //other whens removed
        .otherwise({
            templateUrl: "/public/views/404.view.html"
        });
}