const path = require("path");
const fs = require("fs");
const { request, response } = require("express");
const { subirArchivo } = require("../helpers/index");
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const cargarArchivo = async (req = request, res = response) => {
  try {
    const nombre = await subirArchivo(req.files);

    res.json({ nombre });
  } catch (msg) {
    return res.json({ msg });
  }
};

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuario":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case "producto":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó válidar esto" });
  }

  //Limpiar imágenes previas.
  if (modelo.img) {
    //hay que borrar la imagen del servidor
    const pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  const nombre = await subirArchivo(
    req.files,
    undefined,
    coleccion
  ).catch((err) => res.status(400).json({ msg: err }));

  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
};

//Mostrar img en el front-end
const mostrarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuario":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case "producto":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvidó válidar esto" });
  }
  //Enviar la img
  if (modelo.img) {
    const pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  } else {
    const pathImg = path.join(__dirname, "../assets/img/no-image.jpg");
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  res.json({ msg: "falta el place holder" });
};

module.exports = { cargarArchivo, actualizarImagen, mostrarImagen };
