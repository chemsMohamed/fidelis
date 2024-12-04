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

            if (structure.statut == false) {
                return res.status(402).json({ error: " votres compte est bloquer contacter votre administrateur  " });
            }
            if (structure) {
                const token = jwt.generateTokenForUser(structure);
                return res.status(201).json({
                    nom: structure.nom,
                    token
                });
            } else {
                return res.status(401).json("Code unique incorrect  ");
            }
        } catch (error) {

            return res.status(500).json({ error: "Internal Server Error", error });
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
            }
            const nbrClient = await models.Client.count({ where: { structureId: structure.id } });
            const activite = await models.Activite.findOne({ where: { id: structure.activiteId } });



            return res.status(201).json({
                id: structure.id,
                nom: structure.nom,
                nomBoss: structure.nomBoss,
                numeroTel: structure.numeroTel,
                localisation: structure.localisation,
                logo: structure.logo,
                statut: structure.statut,
                nbrClient: nbrClient,
                statut: structure.statut,
                Activite: activite.domaine,
            });

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

    detailClient: async (req, res) => {

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
                return res.status(404).json({ error: "Utilisateur introuvable " });
            }

            const client = await models.Client.findOne({ where: { id: id } });
            if (client) {
                return res.status(201).json({ 
                    client: client,
                    typeIntervention: structure.typeInterventionId,
                 });
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

        if (!nom || !numeroTel || !prenom || !localisation || !sexe) {
            return res.status(400).json({ error: "parametres manquants" });
        }
        try {
            const structure = await models.Structure.findOne({ where: { id: userId } });
            if (!structure) {
                return res.status(404).json({ error: "Structure Introuvable" });
            }


            const client = await models.Client.create({
                structureId: userId,
                nom: nom,
                prenom: prenom,
                numeroTel: numeroTel,
                localisation: localisation,
                sexe: sexe,


            })
            if (client) {
                return res.status(201).json("Nouvelle Structure cree avec success   =>>>  " + client.nom);
            }


        } catch (err) {
            console.error("Error retrieving test:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
    getAllActivite: async (req, res) => {

        let fields = req.query.fields;
        let limit = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let order = req.query.order;

        const activites = await models.Activite.findAll({

            order: [order != null ? order.split(":") : ["id", "ASC"]],
            attributes: fields !== "*" && fields != null ? fields.split(",") : null,
            limit: !isNaN(limit) ? limit : null,
            offset: !isNaN(offset) ? offset : null,

        })

        if (activites) {
            return res.status(201).json({ activites: activites });
        }

    },
    editClient: async (req, res) => {
        //evoie des autorisation en entete 

        var headerAuth = req.headers["authorization"];
        var userId = jwt.getUserId(headerAuth);


        var nom = req.body.nom;
        var prenom = req.body.prenom;
        var numeroTel = req.body.numeroTel;
        var sexe = req.body.sexe;
        var localisation = req.body.localisation;


        var id = req.params.id;

        if (!nom || !prenom || !numeroTel || !sexe || !localisation) {
            return res.status(400).json({ error: "paramètres manquants" });
        }

        try {


            const structure = await models.Structure.findOne({ where: { id: userId } });
            if (!structure) {
                return res.status(404).json({ error: " Utilisateur introuvable " });
            }
            const client = await models.Client.findOne({ where: { id: id } });
            if (!client) {
                return res.status(404).json({ error: " utilisateur selectionner n'existe pas " });
            } else {
                // console.log("is ok ");


                await client.update({

                    nom: nom ? nom : client.nom,
                    prenom: prenom ? prenom : client.prenom,
                    numeroTel: numeroTel ? numeroTel : client.numeroTel,
                    sexe: sexe ? sexe : client.sexe,
                    localisation: localisation ? localisation : client.localisation,

                })
                    .then(() => {
                        return res.status(201).json({ success: "Client  Modifier !!" });
                    })
                    .catch((err) => {
                        return res.status(500).json({ error: "erreur lors de la modification de l'utilisateur", err });
                    });


            }



        } catch (error) {
            console.error("Erreur lors de la récupération du test :", error);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }


    },






}