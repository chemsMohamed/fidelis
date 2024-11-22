//les iportations
let jwt = require("../utils/jwToken");
const qrcode = require('qrcode');
let models = require("../models");



//routres

module.exports = {


    login: async (req, res) => {

        //parametre ....
        const codeUnique = req.body.codeUnique;

        try {

            //const isCode = await bcrypt.compare(password, utilisateur.motDePasse);
            const structure = await models.Structure.findOne({ where: { codeUnique: codeUnique } });
            if (structure) {
                const token = jwt.generateTokenForUser(structure);
                return res.status(201).json({
                    nom: structure.nom,
                    token
                });
            } else {
                return res.status(500).json("Code unique incorrect  ");
            }
        } catch (error) {
            console.error("Error retrieving test:", err);
            return res.status(500).json({ error: "Internal Server Error", err });
        }
    },

    
}