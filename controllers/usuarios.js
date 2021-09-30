const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role');

    res.json({
        success: true,
        data: usuarios,
        uid: req.uid
    });

};

const crearUsuarios = async(req, res = response) => {

    const { email, password, nombre } = req.body;

    try {

        // validando si ya existe el email
        const existeEmail = await Usuario.findOne({ email });

        if( existeEmail ){
            return res.status(400).json({
                success: false,
                msg: "El email ya está registrado"
            });
        }

        // instanciando objeto con los parametros obtenidos del metodo post inicial
        const usuario = new Usuario( req.body );

        // encriptando password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        //guardando en la bd usando metodo de mongoose
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
           success: true,
           msg: "Usuario creado",
           data: usuario,
           token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Error inesperado, revisar logs"
        });
    }

};

const actualizarUsuario = async ( req, res = response) =>{

    const uid = req.params.id;



    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(400).json({
                success: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // actualizaciones
        const camposPeticion = req.body;

        // si el email del usuario consultado de la bd es exactamente igual al email de la peticion
        // no lo modifica por eso elimina la propiedad antes
        if ( usuarioDB.email === req.body.email ) {
            delete camposPeticion.email;
        // si son email distintos
        }else {
            const existeEmail = await Usuario.findOne({ email: req.body.email });
            if ( existeEmail ) {
                return res.status(500).json({
                    success: false,
                    msg: 'Ya existe un usuario con ese email registrado'
                });
            }
        }

        // eliminando la propiedad password para no ser usada en la peticion de update
        //delete camposPeticion.password;



        // instanciando objeto con los parametros obtenidos del metodo post inicial
        //const usuario = new Usuario( req.body );

        // encriptando password
        const salt = bcrypt.genSaltSync();
        camposPeticion.password = bcrypt.hashSync( camposPeticion.password, salt );







        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, camposPeticion, { new: true } );

        res.json({
            success: true,
            data: usuarioActualizado
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error inesperado'
        });
    }
}


const borrarUsuario = async (req, res = response) =>{

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(400).json({
                success: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            success: true,
            msg: 'Usuario eliminado'
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Error inesperado'
        })
    }

}

const getUsuarioById = async(req, res = response) => {

    const id = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( id );
    
        res.json({
            success: true,
            data: usuarioDB
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            success: true,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario,
    getUsuarioById
}