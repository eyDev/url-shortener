const { Router } = require('express')
const { check, param } = require('express-validator')
const { createURL, deleteURL, getUrls } = require('../controllers/url')
const validateFields = require('../middlewares/validateFields')
const validateJWT = require('../middlewares/validateJWT')

const urlRouter = Router()
urlRouter.use(validateJWT)

urlRouter.post('/', [
    check('urlCode', 'El código de la url solo pueden ser una combinación de números y letras de entre 4 a 8 caractéres.').matches(/^([a-zA-Z0-9]{4,8})$/).toLowerCase(),
    check('longUrl', 'La url no tiene un formato correcto.').isURL(),
    validateFields
], createURL)

urlRouter.get('/', getUrls)

urlRouter.delete('/:uid', [
    param("uid", "El id de la url no tiene un formato correcto.").isMongoId(),
    validateFields
], deleteURL)

module.exports = urlRouter