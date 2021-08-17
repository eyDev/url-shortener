const express = require('express')
const cors = require('cors')
const dbConnection = require('../db/connection')

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            auth: '/api/auth',
            url: '/api/url',
            public: '/',
        }
        this.conectarDB()
        this.midlewares()
        this.routes()
    }

    async conectarDB() {
        await dbConnection()
    }

    midlewares() {
        this.app.use(cors())
        this.app.use(express.json())
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.url, require('../routes/url'))
        this.app.use(this.paths.public, require('../routes/public'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server on ', this.port)
        })
    }
}

module.exports = Server