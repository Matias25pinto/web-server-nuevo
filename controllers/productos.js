const { request, response } = require("express");
const Producto = require("../models/producto");

//obtenerProductos
const obtenerProductos = async (req = request, res = response) => {
  try {
    let { desde = 0, limite = 10 } = req.query;
    desde = parseInt(desde);
    limite = parseInt(limite);
    //Obtener los productos
    const [total, productos] = await Promise.all([
      Producto.countDocuments({ estado: true }),
      Producto.find({ estado: true }).skip(desde).limit(limite),
    ]);

    res.json({ total, productos });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! no se pudo obtener los productos" });
  }
};

//obtenerProducto
const obtenerProducto = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    res.status(200).json({ producto });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! no se pudo obtener el producto", err });
  }
};

//crearProducto
const crearProducto = async (req = request, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase();
    const usuario = req.usuario._id;
    let {
      precio = 0,
      categoria,
      descripcion = "",
      disponible = true,
    } = req.body;
    precio = parseInt(precio);

    //Verificar si existe el producto
    const existeProducto = await Producto.findOne({ nombre });

    if (existeProducto) {
      return res
        .status(400)
        .json({ msg: `ERROR!!! ya existe el producto ${nombre}` });
    }
    //Crear producto
    const producto = new Producto({
      nombre,
      precio,
      categoria,
      descripcion,
      disponible,
      usuario,
    });

    //Guardar producto en la BD
    await producto.save();
    res.status(201).json({ producto });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! no se pudo crear el producto", err });
  }
};
//actualizarProducto
const actualizarProducto = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();
    const existeNombre = await Producto.findOne({ nombre });
    if (existeNombre) {
      return res.status(400).json({ msg: `El nombre ${nombre} ya existe` });
    }
    let { precio, categoria, descripcion, disponible } = req.body;
    const usuario = req.usuario._id;
    precio = parseInt(precio);
    const data = {
      nombre,
      precio,
      categoria,
      descripcion,
      disponible,
      usuario,
    };
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({ producto });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! no se pudo actualizar el producto", err });
  }
};

//borrarProducto
const borrarProducto = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(
      id,
      { estado: false, usuario },
      { new: true }
    );
    res.json({ producto });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "ERROR!!! no se pudo actualizar el producto", err });
  }
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};
