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

    getProfile: async (req, res) => {

        // Récupération des informations d'authentification
        var headerAuth = req.headers["authorization"];
        var userId = jwt.getUserId(headerAuth);

        if (userId < 0) {
            return res.status(400).json({ error: "connection perdu", userId });
        }

        try {
            const structure = await models.Structure.findOne({ where: { id: userId } });
            if (!structure) {
                return res.status(404).json({ error: "Utilisateur introuvable ", userId });
            } else {

                return res.status(201).json({ structure: structure });
            }
        } catch {
            return res.status(404).json({ error: "erreur cote back-end " });
        }
    },

    getAllClient: async (req, res) => {
        //getting auth header
        var headerAuth = req.headers["authorization"];
        var userId = jwt.getUserId(headerAuth);

        try {

            const structure = await models.Structure.findOne({ where: { id: userId } });
            if (!structure) {
                return res.status(404).json({ error: "utilisateur introuvable" });
            }

            let fields = req.query.fields;
            let limit = parseInt(req.query.limit);
            let offset = parseInt(req.query.offset);
            let order = req.query.order;

            models.Client.findAll({
                where: { structureId: userId },
                order: [order != null ? order.split(":") : ["id", "ASC"]],
                attributes: fields !== "*" && fields != null ? fields.split(",") : null,
                limit: !isNaN(limit) ? limit : null,
                offset: !isNaN(offset) ? offset : null,
            })
                .then((allClients) => {
                    return res.status(201).json({
                        allClients: allClients

                    });
                })
                .catch((error) => {
                    return res.status(404).json({ error: "impossible de trouver des clients " });
                });
        } catch (error) {
            return res.status(404).json({ error: "erreur cote back-end" });
        }
    },

    getClient: async (req, res) => {

        // Récupération des informations d'authentification
        var headerAuth = req.headers["authorization"];
        var userId = jwt.getUserId(headerAuth);

        var id = req.params.id;

        if (userId < 0) {
            return res.status(400).json({ error: "connection perdu", userId });
        }

        try {

            const structure = await models.Structure.findOne({ where: { id: userId } });
            if (!structure) {
                return res.status(404).json({ error: "Utilisateur introuvable ", userId });
            }

            const client = await models.Client.findOne({ where: { id: id } });
            if (client) {
                return res.status(201).json({ client: client });
            } else {
                return res.status(404).json({ error: "Client introuvable " });
            }

        } catch {
            return res.status(404).json({ error: "erreur cote back-end " });
        }
    },

    createClient: async (req, res) => {
        var headerAuth = req.headers["authorization"];
        var userId = jwt.getUserId(headerAuth);

        var nom = req.body.nom;
        var prenom = req.body.prenom;
        var numeroTel = req.body.numeroTel;
        var sexe = req.body.sexe;
        var localisation = req.body.localisation;

        if (!nom || !numeroTel || !prenom || !localisation ) {
            return res.status(400).json({ error: "parametres manquants" });
        }
        try {
            const structure = await models.Structure.findOne({ where: { id: userId } });
            if (!structure) {
                return res.status(404).json({ error: "structure Introuvable" });
            }

            const client = await models.Client.create({
                utilisateurId: userId,
                nom: nom,
                prenom: prenom,
                numeroTel: numeroTel,
                localisation: localisation,
                sexe: sexe,
                
               
            })
            if (client) {
                return res.status(201).json("Nouvelle Structure cree avec success   =>>>  " + client);
            }


        } catch (err) {
            console.error("Error retrieving test:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },





}