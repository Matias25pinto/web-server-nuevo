const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
  //Validar campos
  const errors = validationResult(req); //validationResult(req); verifica si en el req hubo algún error
  //isEmpty devuelve true si hay un valor vacio, de lo contrario devuelve false
  //si isEmpty tiene valor es porque existio un error por lo tanto lanzamos el error
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next(); //Si todo sale bien pasa al siguiente middleware, o al controlador
};

module.exports = { validarCampos };
