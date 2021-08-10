const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("token");//para acceder a elementos del header

  if (!token) {
    return res.status(400).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    //Si el token no es válido va explotar en error y es capturado por el catch
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const usuario = await Usuario.findById(uid);

    //Verificar si el usuario existe
    if (!usuario) {
      return res.status(401).json({
        msg: "Token no válido - uid no existe en la BD",
      });
    }

    // verificar si el usuario tiene estado en true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existe en la BD",
      });
    }

    req.usuario = usuario;// creo la propiedad usuario dentro de req
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token no válido" });
  }
};

module.exports = {
  validarJWT,
};
