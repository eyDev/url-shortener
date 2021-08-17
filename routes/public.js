const { Router } = require('express')
const { redirectURL } = require('../controllers/public')

const publicRouter = Router()

publicRouter.get('/:code', redirectURL)

module.exports = publicRouter