app = angular.module("LecterApp");

app.controller("MainController", MainController);
function MainController($scope){
    console.log("MAIN controller working");
    var vm = this;

    vm.inictr = IniCtr;

    vm.inictr();
    /**
     * @description Da inicio al controlador
     * @author Miguel Ángel Henao Pérez
     * @return {void}
     */
    function IniCtr() {
        try {
        } catch (error) {
            console.log(error);
        }
    }
}

