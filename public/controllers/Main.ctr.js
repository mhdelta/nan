app = angular.module("LecterApp");

app.controller("MainController", MainController);
function MainController($scope){
    console.log("MAIN controller working");
    var vm = this;

    vm.inictr = IniCtr;
    vm.guardarCorreo = GuardarCorreo;

    vm.inictr();
    /**
     * @description Da inicio al controlador
     * @author Miguel Ángel Henao Pérez
     * @return {void}
     */
    function IniCtr() {
        try {
            console.log("hellllo");
        } catch (error) {
            console.log(error);
        }
    }

    function GuardarCorreo(){
        console.log(vm.email);
        console.log("hi");
        
    } 
}

