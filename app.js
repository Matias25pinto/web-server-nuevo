require('dotenv').config();

const Server = require("./models/server"); //Los const de modelos siempre en mayusculas


const server = new Server(); //Creamos el objeto del modelo.

//Se le indica al servidor que escuche un puerto
server.listen();
