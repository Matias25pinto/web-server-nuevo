const express = require("express");
const fileUpload = require("express-fileupload");
var cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    //Conectar a la BD
    this.conectarBD();
    //Middlewares
    this.middleware();
    //Rutas
    this.routes();
  }

  async conectarBD() {}

  routes() {}

  middleware() {
    //CORS, es un middleware para gestionar el acceso a la api los navegadores lo piden de manera obligatoria
    this.app.use(cors());

    //JSON, es un middleware que lee y luego parsea lo enviado en el body a un objeto json
    this.app.use(express.json());

    //Es un middleware que permite hacer publica una carpeta
    this.app.use(express.static("public"));

    //Fileupload - Carga de archivos
    // Note that this option available for versions 1.0.0 and newer.
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
      })
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("El restserver se esta ejecutando en el puerto: ", this.port);
    });
  }
}

module.exports = Server;
