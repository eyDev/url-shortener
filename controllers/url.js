const Url = require('../models/url')
const User = require('../models/user')
const DOMAIN = process.env.DOMAIN

const createURL = async (req, res) => {
    const { urlCode, longUrl } = req.body
    const userID = req.uid
    try {
        const existUrlCode = await Url.findOne({ urlCode })
        if (existUrlCode) {
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        "msg": "El código de la url ya existe.",
                        "param": "url",
                        "location": "user"
                    }
                ]
            })
        }

        const url = new Url({ urlCode, longUrl, shortUrl: `${DOMAIN}/${urlCode}` })
        const savedURL = await url.save()
        await User.findByIdAndUpdate(
            userID,
            { $addToSet: { urls: savedURL._id } },
        )
        return res.status(201).json({
            ok: true,
            url: savedURL
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

const getUrls = async (req, res) => {
    const userID = req.uid
    try {
        const { urls } = await User.findById(userID).populate('urls').select('urls')
        return res.status(200).json({
            ok: true,
            urls
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

const deleteURL = async (req, res) => {
    const { uid } = req.params
    const userID = req.uid
    try {
        const urlExistsInUser = await User.findOne({ $and: [{ urls: { $in: [uid] } }, { _id: userID }] })
        if (!urlExistsInUser) {
            return res.status(404).json({
                ok: false,
                errors: [
                    {
                        "msg": "La url no existe o no pertenece a tu cuenta.",
                        "param": "url",
                        "location": "server"
                    }
                ]
            })
        }
        await Url.findByIdAndDelete(uid)
        await User.findByIdAndUpdate(
            userID,
            { $pull: { urls: { $in: [uid] } } },
        )
        return res.status(200).json({
            ok: true,
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
    createURL,
    getUrls,
    deleteURL
}