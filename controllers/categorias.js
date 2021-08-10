const { request, response } = require("express");

const Categoria = require("../models/categoria");

//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  let { desde = 0, limite = 10 } = req.query;
  desde = parseInt(desde);
  limite = parseInt(limite);

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .populate("usuario")
      .skip(desde)
      .limit(limite),
  ]);

  res.json({ total, categorias });
};

//obtenerCategoria populate
const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario");

  res.json({ categoria });
};

const crearCategoria = async (req = request, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
      return res.status(400).json({
        msg: `La categoría ${nombre}, ya existe`,
      });
    }
    //Generar la data a guardar
    const data = {
      nombre,
      usuario: req.usuario._id,
    };

    const categoria = new Categoria(data);
    //Guardar DB
    await categoria.save();
    res.status(201).json({ categoria });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! no se pudo crear la categoría" });
  }
};

//actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
      return res.status(400).json({
        msg: `La categoría ${nombre}, ya existe`,
      });
    }
    //Generar la data a guardar
    const data = {
      nombre,
      usuario: req.usuario._id,
    };
    //Editar BD
    const categoria = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(201).json({ categoria });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! no se pudo editar la categoría" });
  }
};

//borrarCategoria - estado:false
const borrarCategoria = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario;
    const data = { estado: false, usuario };
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    res.json({ categoria });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! no se pudo eliminar la categoría" });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
