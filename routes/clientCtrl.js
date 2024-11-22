//les iportations
let jwt = require("../utils/jwToken");
const qrcode = require('qrcode');
let models = require("../models");
const structure = require("../models/structure");



//routres

module.exports = {


    validation: async (req, res) => {

        //donnee en entree...............
        var qte = req.body.qte;

        //parametre ....
        var id = req.params.id;



        try {
            const client = await models.Client.findOne({ where: { id: id } });


            if (!client) {
                return res.status(404).json({ error: "Client Introuvable" });
            }
            console.log(client.structureId);


            const structure = await models.Structure.findOne({ where: { id: client.structureId } });

            if (!structure) {
                return res.status(404).json({ error: "Pas de Correspondance Avec Une Structure " });
            }


            await client.update({
                intervention1: client.intervention1 + 1,
                intervention2: qte,
            });

            // Vérification des conditions pour le bonus
            if (client.intervention1 > structure.limite1 ) {
                // Incrémentation du bonus et envoi de la réponse
                await client.update({ 
                    bonus: client.bonus + 1,
                    intervention1: 0
                 });
                return res.status(201).json({
                    FELICITATION: "En tant que client fidèle, veuillez accepter ce petit cadeau offert par la maison !!"
                });
            } else if(client.intervention2 >= structure.limite2){
                // Aucune condition remplie, renvoyer une réponse différente si nécessaire
                await client.update({ 
                    bonus: client.bonus + 1,
                 });
                return res.status(201).json({
                    FELICITATION: "En tant que client fidèle, veuillez accepter ce petit cadeau offert par la maison !!"
                });
            }else{
                return res.status(200).json({ message: "Action du client correctement emregistrer" });
            }

        } catch (error) {
            //console.error("Error retrieving test:", error);
            return res.status(500).json({ error: "Internal Server Error", error });
        }
    }


}