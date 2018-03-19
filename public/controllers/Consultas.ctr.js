app = angular.module("LecterApp");

app.controller("ConsultasController", ConsultasController);
function ConsultasController($scope){
    var vm = this;
    console.log("Info controller working...");

    var cth = document.getElementById("chartHelados");

    
    var helados = new Chart(cth, {
        type: 'bar',
        data: {
            labels: ["Coco", "Mora", "Chocolate", "Maracuya"],
            datasets: [{
                label: '# de helados',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
    
    var ctc = document.getElementById("chartCerveza");
    
    var cervezas = new Chart(ctc, {
        type: 'bar',
        data: {
            labels: ["Poker"],
            datasets: [{
                label: '# de cerveza',
                data: [17],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)'
                ],
                borderWidth: 1
            }]
        }
    });

}

