const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password, No es correcto ",
      });
    }
    //Si el usuario esta activo en la BD
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password, No es correcto ",
      });
    }
    //Verificar el password
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password, No es correcto ",
      });
    }

    //Generar JWT
    const token = await generarJWT(usuario.id);
    res.json({
      msg: "Login ok",
      usuario,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;
  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });
    //Si el usuario no existe
    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ":p",
        img,
        rol: "USER_ROLE",
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }
    //Si el usuario en BD
    if (!usuario.estado) {
      return res
        .status(401)
        .json({ msg: "Hable con el administrador, usuario bloqueado" });
    }
    //Generar el JSON WEB TOKEN
    const token = await generarJWT(usuario.id);

    res.json({ usuario, token });
  } catch (err) {
    res.status(400).json({ msg: "Token de Google no válido" });
  }
};

module.exports = { login, googleSignIn };
