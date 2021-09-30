/*
  Ruta: /api/usuarios 
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getUsuarios, crearUsuarios, actualizarUsuario, borrarUsuario, getUsuarioById } = require('../controllers/usuarios')
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router()

router.get( '/', 
    //validarJWT, 
    getUsuarios 
);

router.get( '/:id',
    //validarJWT,
    getUsuarioById
);

router.post( '/', 
    [
      check('nombre','El nombre es obligatorio').not().isEmpty(),
      check('password', 'El password es obligatorio').not().isEmpty(),
      check('email','El email es obligatorio').isEmail(),
      validarCampos
    ],
    crearUsuarios 
);

router.put( '/:id', 
    [
      //validarJWT,
      check('nombre','El nombre es obligatorio').not().isEmpty(),
      check('email', 'El email es obligatorio').not().isEmpty(),
      check('role','El rol es obligatorio').not().isEmpty(),
      validarCampos
    ],
    actualizarUsuario );

router.delete( '/:id', 
    [
      //check('nombre','El nombre es obligatorio').not().isEmpty(),
      //check('email', 'El email es obligatorio').not().isEmpty(),
      //check('role','El rol es obligatorio').not().isEmpty(),
      //validarCampos
    ],
    //validarJWT,
    borrarUsuario 
);

module.exports = router;