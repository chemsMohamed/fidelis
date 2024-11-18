//les iportations
let jwt = require("../utils/jwToken");

let models = require("../models");



//routres

module.exports = {
    create: async (req, res) => {


        //parametres evoyer ...

        var nom = req.body.nom;
        var numeroTel = req.body.numeroTel;
        var codeCommercial = req.body.codeCommercial;
        var roleId = req.body.roleId;

        if (!nom || !numeroTel || !codeCommercial) {
            return res.status(400).json({ error: "paramètres manquants" });
        }
        try {

            function generateUniqueCode4() {
                // Génère un nombre aléatoire entre 1000 et 9999 (4 chiffres)
                const code = Math.floor(Math.random() * 9000) + 1000;
                return code;
            }
            function generateUniqueCode() {
                // Génère un nombre aléatoire entre 10000 et 99999 (5 chiffres)
                const code = Math.floor(Math.random() * 90000) + 10000;
                return code.toString();
            }


            if (generateUniqueCode() || generateUniqueCode4()) {

                const role = await models.Role.findOne({ where: { id: roleId } })

                if (role.id == 1) {
                    const codeExistant = await models.Structure.findOne({ where: { codeUnique: generateUniqueCode() } });

                    while (codeExistant != null) {

                        console.log(role.id);
                        console.log(nouvauCode);
                        nouvauCode = generateUniqueCode()


                    }
                    const structure = await models.Structure.create({
                        nom: nom,
                        numeroTel: numeroTel,
                        codeUnique: generateUniqueCode(),
                        codeCommercial: codeCommercial,
                        roleId: roleId,
                    })
                    if (structure) {
                        return res.status(201).json("Nouvelle Structure cree avec success " + structure.codeUnique);
                    }
                } else {
                    const codeExistant = await models.Structure.findOne({ where: { codeUnique: generateUniqueCode4() } });

                    while (codeExistant != null) {

                        console.log(nouvauCode);
                        console.log(role.id);
                        nouvauCode = generateUniqueCode4()

                    }
                    const structure = await models.Structure.create({
                        nom: nom,
                        numeroTel: numeroTel,
                        codeUnique: generateUniqueCode4(),
                        codeCommercial: codeCommercial,
                        roleId: roleId,
                    })
                    if (structure) {
                        return res.status(201).json("Nouvelle Structure cree avec success " + structure.codeUnique);
                    }
                }



            }




        } catch (err) {
            console.error("Error retrieving test:", err);
            return res.status(500).json({ error: "Internal Server Error", err });
        }
    },
    login: async (req, res) => {

        //parametre ....
        const codeUnique = req.body.codeUnique;

        try {
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
    updateProfile: async (req, res) => {
        // Récupération des informations d'authentification
        var headerAuth = req.headers["authorization"];
        var userId = jwt.getUserId(headerAuth);

        // Paramètres de l'utilisateur
        var nom = req.body.nom;
        var numeroTel = req.body.numeroTel;


        if (
            nom == null ||
            numeroTel == null

        ) {
            return res.status(400).json({ error: "missing parameters" });
        }

        if (userId < 0) {
            // console.log("erreur ",userId);
            return res.status(400).json({ error: "please go to connect " });
        }



        try {
            const structure = await models.Structure.findOne({ where: { id: userId } });
            if (!structure) {
                return res.status(404).json({ error: "user not found " });
            } else {
                console.log("is ok ");

                await structure.update({
                    nom: nom ? nom : structure.nom,
                    numeroTel: numeroTel ? numeroTel : structure.numeroTel,

                })
                    .then(() => {
                        return res.status(201).json({ success: "user edited" });
                    })
                    .catch((err) => {
                        return res.status(500).json({ error: "cannot edit user" });
                    });
            }




        } catch {
            return res.status(404).json({ error: "erreur cote back-end " });
        }
    },
    getProfile: async (req, res) => {

        // Récupération des informations d'authentification
        var headerAuth = req.headers["authorization"];
        var userId = jwt.getUserId(headerAuth);

        if (userId < 0) {
            return res.status(400).json({ error: "wrong token", userId });
        }

        try {
            const structure = await models.Structure.findOne({ where: { id: userId } });
            if (!structure) {
                return res.status(404).json({ error: "user not found ", userId });
            }
            const role = await models.Role.findOne({
                where: { id: structure.roleId },
            });

            return res.status(201).json({ structure: structure, role: role });
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
            return res.status(404).json({ error: "utilisateur not found" });
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
                allClients:allClients
               
              });
            })
            .catch((error) => {
              return res.status(404).json({ error: "user not found " });
            });
        } catch (error) {
          return res.status(404).json({ error: "cannot find users" });
        }
      },




}