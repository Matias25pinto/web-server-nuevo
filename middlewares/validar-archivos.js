const { request, response } = require("express");
const validarArchivos = (req = request, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: "No hay archivos que subir" });
    return;
  }

  next();
};

module.exports = validarArchivos;
