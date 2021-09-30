const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = ( req, res = response, next ) => {

    // reviso si hay errores en la request
    const errores = validationResult( req );

    // si encuentra dispara todos los errores encontrados
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    // si no hay errores llama al next
    next();

}

module.exports = {
    validarCampos
}