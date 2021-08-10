const { response } = require("express"); //utilizamos response de esta forma la peticion termina automaticamente se envia el res, de lo contrario se tendria que usar res.end; para terminar la conexion
const bcryptjs = require("bcryptjs"); //bcryptjs es distinto a bcrypt

const Usuario = require("../models/usuario");

const usuariosGet = async (req, res = response) => {
  let { limite = 5, desde = 0 } = req.query; //Extraer los argumentos
  const query = { estado: true };
  limite = parseInt(limite); //Convertir el query en number
  desde = parseInt(desde);
  //Promise.all, se utiliza cuando debo ejecutar mas de una promesa de esta forma se ejecutan al mismo tiempo,
  //y no se debe estar esperando que una promesa termine para que se ejecute la siguiente
  //Desestructuración de arreglos
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(desde).limit(limite),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;

  //Crear Objeto usuario
  usuario = new Usuario({
    nombre,
    correo,
    password,
    rol,
  });

  //Encriptar la contraseña
  const salt = bcryptjs.genSaltSync(); //el numero de vueltas para encriptar 10, es por defecto
  usuario.password = bcryptjs.hashSync(password, salt); //para encriptar en una sola via
  //Grabar en la BD
  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params; //extraer parametro del url
  //Sacar password, google, correo y actualizar el resto
  const { _id, password, google, correo, ...resto } = req.body;

  //Validar contra BD
  if (password) {
    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    //Se crea la propiedad password en resto
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });
  res.json({ usuario });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  const usuarioAutenticado = req.usuario;

  //cambiar el estado del usuario para eliminar
  const usuario = await Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json({ usuario, usuarioAutenticado });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
