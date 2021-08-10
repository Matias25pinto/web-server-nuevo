const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  estado: {
    type: Boolean,
    default: true,
    required: false,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  precio: {
    type: Number,
    default: 0,
    required: false,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  descripction: {
    type: String,
    required: false,
  },
  disponible: {
    type: Boolean,
    default: true,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
});

module.exports = model("Producto", ProductoSchema);
