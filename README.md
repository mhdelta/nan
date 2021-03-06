# Lecter

![N|Solid](https://meanstacktips.files.wordpress.com/2015/09/cropped-mean-stack-logo1.jpg)

Lecter es una aplicación web que utiliza todo el stack de MEAN, mongo, Express, Angular y NodeJs.
Nace de un problema en particular y es el manejo de los inventarios de una venta de helados y cerveza en una cancha de futbol. 
El aplicativo cuenta con los siguientes módulos:

  - Compra de mercancia, incluye helados y cerveza.
  - Venta de mercancia, incluye helados y cerveza.
  - Predicción de ventas para los partidos de la siguiente semana
  - Visualización de datos en el apartado "Consultas"

### Dependencias

Lecter utiliza algunas dependecias para funcionar correctamente:

* [Angular] - HTML con superpoderes para aplicaciones web!
* [markdown-it] - Un compilador de lenguaje Mark Down.
* [Twitter Bootstrap] - CSS precompilado para páginas web.
* [node.js] - Entorno de ejecución por eventos construido en JavaScript para el backend.
* [Express] - Framework de nodejs para el manejo de peticiones.
* [MongoDB] - Base de datos no relacional basada en documentos.
* [Chart.js] - Tablas y visualización de datos en JavaScript.

### Installation

Lecter requiere [Node.js](https://nodejs.org/) en su versión 8.9.4 para funcionar.
Instale node, y a través del manejador de paquetes npm instale las dependencias.

## Linux
Procure inicialmente cambiar la versión de node con [NVM](https://github.com/creationix/nvm) 
Puede instalar facilmente nvm usando el comando: 
```sh
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.9/install.sh | bash
```
Posteriormente ejecute lo siguiente:

```sh
$ cd lecter
$ nvm install node 8.9.4
$ npm install
$ node server.js
```

## Windows
Procure inicialmente cambiar la versión de node con [n](https://github.com/tj/n) 
Puede instalar facilmente n usando el comando: 
```sh
$ npm install -g n
```
Posteriormente ejecute lo siguiente:

```sh
$ cd lecter
$ n 8.9.4
$ n 8.9.4
$ npm install
$ node server.js
```

Posteriormente ingrese un numero de puerto (por ejemplo 5000) y diríjase al localhost:5000 en su navegador favorito.

### Sobre el autor

Mi nombre es Miguel Ángel Henao y soy un estudiante de ingeniería de sistemas en la Universidad Tecnológica de Pereira.
Disfruto mucho programar y aprender todos los días algo nuevo, seguir mejorando es mi meta!

Actualmente estoy desarrollando aplicaciones web para [Geminus Software](http://www.geminus.com.co/) y puedes contactarme por esta cuenta de GitHub o a mi correo miguelangelutp@gmail.com

