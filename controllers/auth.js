const User = require('../models/user')
const bcrypt = require('bcryptjs')
const generateJWT = require('../helpers/generateJWT')

const createUser = async (req, res) => {
    const { email, password, name } = req.body
    try {
        const emailExists = await User.findOne({ email })
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        "msg": "Este correo ya existe",
                        "param": "email",
                        "location": "user"
                    }
                ]
            })
        }
        const user = new User({ email, password, name })

        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(password, salt)
        await user.save()

        const token = await generateJWT(user.id)
        return res.status(201).json({
            ok: true,
            usuario: user,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    "msg": "Error Interno.",
                    "param": "server",
                    "location": "server"
                }
            ]
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const userDB = await User.findOne({ email })
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                errors: [
                    {
                        "msg": "Email no encontrado.",
                        "param": "email",
                        "location": "user"
                    }
                ]
            })
        }
        const validatePassword = bcrypt.compareSync(password, userDB.password)
        if (!validatePassword) {
            return res.status(404).json({
                ok: false,
                errors: [
                    {
                        "msg": "Contraseñá Incorrecta!",
                        "param": "email",
                        "location": "user"
                    }
                ]
            });
        }
        const token = await generateJWT(userDB.id)
        return res.status(200).json({
            ok: true,
            usuario: userDB,
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    "msg": "Error Interno.",
                    "param": "server",
                    "location": "server"
                }
            ]
        })
    }
}

module.exports = {
    createUser,
    login,
}