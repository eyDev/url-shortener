const Url = require('../models/url')

const redirectURL = async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code })
        if (url) {
            return res.redirect(url.longUrl)
        }
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    "msg": "La URL no ha sido encontrada",
                    "param": "server",
                    "location": "server"
                }
            ]
        })
    }
    catch (error) {
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
    redirectURL,
}