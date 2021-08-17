const { Router } = require('express')
const { check } = require('express-validator')
const { createUser, login } = require('../controllers/auth')
const validateFields = require('../middlewares/validateFields')

const userRouter = Router()

userRouter.post('/login', [
    check('email', 'El email no tiene un formato correcto.').isEmail().toLowerCase(),
    check('password', 'La contraseña debe contener de 8 a 14 caractéres, al menos una mayúscula, minúscula, número y caracter especial.').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,14}$/),
    // Minimum eight and maximum 14 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    validateFields
], login)

userRouter.post(
    '/register',
    [
        check('name', 'El nombre no tiene un formato correcto.').matches(/^[a-zA-Z ]+$/),
        check('email', 'El email no tiene un formato correcto.').isEmail().toLowerCase(),
        check('password', 'La contraseña debe contener de 8 a 14 caractéres, al menos una mayúscula, minúscula, número y caracter especial.').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,14}$/),
        validateFields,
    ],
    createUser
)

module.exports = userRouter