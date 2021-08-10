const Role = require("../models/role");
const Usuario = require("../models/usuario");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const esRoleValido = async (rol = "") => {
  try {
    const exiteRol = await Role.findOne({ rol });
    if (!exiteRol) {
      //Lanzar un error personalizado
      throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
  } catch (err) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
};

const esEmailValido = async (correo = "") => {
  //Verificar si el correo existe
  try {
    const existeCorreo = await Usuario.findOne({ correo });
    if (existeCorreo) {
      throw new Error(`El correo ${correo} ya está registrado`);
    }
  } catch (err) {
    throw new Error(`El correo ${correo} ya está registrado`);
  }
};

const existeUsuarioPorId = async (id) => {
  //Verificar si existe usuario
  try {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
      throw new Error(`El id ${id} no existe en la BD`);
    }
  } catch (err) {
    throw new Error(`El id ${id} no existe en la BD`);
  }
};

const existeCategoria = async (id) => {
  //Verificar si existe categoría
  try {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
      throw new Error(`El id ${id} no existe en la BD`);
    }
  } catch (err) {
    throw new Error(`El id ${id} no existe en la BD`);
  }
};

const existeProducto = async (id) => {
  try {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
      throw new Error(`El id ${id} no existe en la BD`);
    }
  } catch (err) {
    throw new Error(`El id ${id} no existe en la BD`);
  }
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);

  if (!incluida) {
    throw new Error(`La colección ${coleccion} no es permitida`);
  }

  return true;
};

module.exports = {
  esRoleValido,
  esEmailValido,
  existeUsuarioPorId,
  existeCategoria,
  existeProducto,
  coleccionesPermitidas,
};
