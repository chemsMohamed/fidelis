//les iportations
let jwt = require("../utils/jwToken");
const qrcode = require('qrcode');
let models = require("../models");
const structure = require("../models/structure");
const { log } = require("async");



//routres

module.exports = {


    validation: async (req, res) => {

        var headerAuth = req.headers["authorization"];
        var userId = jwt.getUserId(headerAuth);
        //parametre ....
        var id = req.params.id;

        var qte = req.body.qte;



        if (userId < 0) {
            return res.status(400).json({ error: "connection perdu" });
        }

        try {

            const structureCon = await models.Structure.findOne({ where: { id: userId } });
            if (!structureCon) {
                return res.status(401).json({ error: "Utilisateur Introuvable " });
            }

            const client = await models.Client.findOne({ where: { id: id } });


            if (!client) {
                return res.status(404).json({ error: "Client Introuvable" });
            }

            if (client.structureId != structureCon.id) {
                return res.status(403).json({ error: " Le client n'est pas de la structure " });
            }
            console.log(structureCon.typeInterventionId);
            if (structureCon.typeInterventionId == 1) {
                console.log(true);
                await client.update({
                    trace: client.trace + 1,
                    intervention: client.intervention +1
                });
                if (client.trace >= structureCon.limite) {
                    await client.update({
                        trace: 0,
                        bonus: client.bonus + 1,
                    });
                    return res.status(201).json({ message: " felicitation pour votre fidelite , veillez accepter ce petit present offert par la structure " });
                } else {
                    return res.status(200).json({ message: " Action du client correctement enregistrer " });
                }
            } else {
                console.log("typeIntervention  ::: ===>> ",structureCon.typeInterventionId);

                return res.status(201).json({ typeIntervention : structureCon.typeInterventionId }); 
                

            }


        } catch (error) {
            console.error("Error retrieving test:", error);
            return res.status(500).json({ error: "Internal Server Error", error });
        }
    },
    validationType2: async (req, res) => {

        var headerAuth = req.headers["authorization"];
        var userId = jwt.getUserId(headerAuth);
        //parametre ....
        var id = req.params.id;
        var qte = req.body.qte;



        if (userId < 0) {
            return res.status(400).json({ error: "connection perdu" });
        }

        try {

            const structureCon = await models.Structure.findOne({ where: { id: userId } });
            if (!structureCon) {
                return res.status(401).json({ error: "Utilisateur Introuvable " });
            }

            const client = await models.Client.findOne({ where: { id: id } });


            if (!client) {
                return res.status(404).json({ error: "Client Introuvable" });
            }

            if (client.structureId != structureCon.id) {
                return res.status(403).json({ error: " Le client n'est pas de la structure " });
            }

           
            var Qte = parseInt(qte);
            await client.update({

                trace: client.trace + Qte,
                intervention: client.intervention + Qte
            });
            // console.log(structureCon.limite);

            console.log("trace ====>>> ", client.trace);

            if (client.trace > structureCon.limite) {
 

                await client.update({
                    trace: 0,
                    bonus: client.bonus + 1,
                });
                return res.status(201).json({ message: " felicitation pour votre fidelite , veillez accepter ce petit present offert par la structure " });
            } else {

                return res.status(200).json({ message: " Action du client correctement enregistrer " });
            }

           

        } catch (error) {
            console.error("Error retrieving test:", error);
            return res.status(500).json({ error: "Internal Server Error", error });
        }
    },
    nbrInterventionClient: async (req, res) => {

        var headerAuth = req.headers["authorization"];
        var userId = jwt.getUserId(headerAuth);
        //parametre ....
        var id = req.params.id;

        //var nbrIntervention = req.body.qte;



        if (userId < 0) {
            return res.status(400).json({ error: "connection perdu" });
        }

        try {

            const structureCon = await models.Structure.findOne({ where: { id: userId } });
            if (!structureCon) {
                return res.status(401).json({ error: "Utilisateur Introuvable " });
            }

            const client = await models.Client.findOne({ where: { id: id } });


            if (!client) {
                return res.status(404).json({ error: "Client Introuvable" });
            }

            if (client.structureId != structureCon.id) {
                return res.status(403).json({ error: " Le client n'est pas de la structure " });
            }

             
            return res.status(201).json({ nbrIntervention: client.intervention });


        } catch (error) {
            console.error("Error retrieving test:", error);
            return res.status(500).json({ error: "Internal Server Error", error });
        }
    },



}