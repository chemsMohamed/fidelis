//les iportations
const {Op} = require('sequelize');
const Sequelize = require('sequelize');
let jwt = require("../utils/jwToken");
let models = require("../models");
const structure = require("../models/structure");
const { getAllStructure } = require("./utilisateurCtrl");



//routres

module.exports = {


  countStructure: async (req, res) => {

  

    const structure = await models.Structure.count({})

    if (structure) {
      return res.status(201).json({

        allStructure: structure,
      });
    } else {
      return res.status(200).json({ nbreStructure: 0 });
    }

  },
  countStructureSalon: async (req, res) => {


    const structure = await models.Structure.count({ where: { activiteId: 1 } })

    if (structure) {
      return res.status(201).json({ nbreSalon: structure });
    } else {
      return res.status(200).json({ nbreSalon: 0 });
    }
  },
  countStructurePressing: async (req, res) => {


    const structure = await models.Structure.count({ where: { activiteId: 2 } })

    if (structure) {
      return res.status(201).json({ nbrPressing: structure });
    } else {
      return res.status(200).json({ nbrPressing: 0 });
    }
  },
  countCommerciaux: async (req, res) => {


    const nbrCommerciaux = await models.Utilisateur.count({ where: { roleId: 2 } })

    if (nbrCommerciaux) {
      return res.status(201).json({ nbrCommerciaux: nbrCommerciaux });
    } else {
      return res.status(200).json({ nbrCommerciaux: 0 });
    }
  },
  countCommerciauxDesactives: async (req, res) => {


    const nbrCommerciaux = await models.Utilisateur.count({ where: { roleId: 2, statut: false } })

    if (nbrCommerciaux) {
      return res.status(201).json({ nbrCommerciaux: nbrCommerciaux });
    } else {
      return res.status(200).json({ nbrCommerciaux: 0 });
    }
  },
  countCommerciauxActives: async (req, res) => {


    const nbrCommerciaux = await models.Utilisateur.count({ where: { roleId: 2, statut: true } })

    if (nbrCommerciaux) {
      return res.status(201).json({ nbrCommerciaux: nbrCommerciaux });
    } else {
      return res.status(200).json({ nbrCommerciaux: 0 });
    }
  },
  countStructureDesactivees: async (req, res) => {


    const nrStructure = await models.Structure.count({ where: { statut: false } })

    if (nrStructure) {
      return res.status(201).json({ nrStructure: nrStructure });
    } else {
      return res.status(200).json({ nrStructure: 0 });
    }
  },
  countStructureActivees: async (req, res) => {


    const nrStructure = await models.Structure.count({ where: { statut: true } })

    if (nrStructure) {
      return res.status(201).json({ nrStructure: nrStructure });
    } else {
      return res.status(200).json({ nrStructure: 0 });
    }
  },
  bestCommercial: async (req, res) => {


    try {
      const bestCommercial = await models.Utilisateur.findOne({
        attributes: ['id', 'nom'[Sequelize.literal('(SELECT COUNT(*) FROM Structures WHERE Structures.codeCommercial = Utilisateurs.code)'), 'structureCount']],
        order: [['structureCount', 'DESC']],
        limit: 1
      });
      if (bestCommercial) {
        return res.status(201).json({ bestCommercial: bestCommercial });
      }

      console.log(bestCommercial); // Affichera l'utilisateur ayant le plus grand nombre de clients
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    }
  },
  clientFidels: async (req, res) => {

    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    if (userId < 0) {
      return res.status(400).json({ error: "connection perdu" });
    }

    try {
      const structure = await models.Structure.findOne({ where: { id: userId } });
      if (!structure) {
        return res.status(401).json({ error: " Utilisateur introuvable " });
      }
      let fields = req.query.fields;
      let limit = parseInt(req.query.limit);
      let offset = parseInt(req.query.offset);
      let order = req.query.order;

      models.Client.findAll({
        where: { structureId:structure.id,
          bonus: {
            [Op.gte]: 1 // Sélectionner les clients avec un bonus supérieur ou égal à 1
          }
        },
        
        order: [order != null ? order.split(":") : ["bonus", "ASC"]],
        attributes: fields !== "*" && fields != null ? fields.split(",") : null,
        limit: !isNaN(limit) ? limit : null,
        offset: !isNaN(offset) ? offset : null,

      })
        .then((client) => {
          return res.status(201).json({
            listClientFidele: client

          });
        })
        .catch((error) => {
          return res.status(404).json({ error: "pas d'utilisateur trouvé ", error });
        });

    } catch (error) {
      return res.status(500).json({ error: "erreur cote back-end", error });
    }

  },
  nbrClientFor: async (req, res) => {

    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    if (userId < 0) {
      return res.status(400).json({ error: "connection perdu" });
    }

    try {

      const structure = await models.Structure.findOne({ where: { id: userId } });
      if (!structure) {
        return res.status(401).json({ error: " Utilisateur introuvable " });
      }

      

      models.Client.count({
        where: { structureId:structure.id},

      })
        .then((client) => {
          return res.status(201).json({
            nbrClient: client

          });
        })
        .catch(() => {
          return res.status(200).json({ nbrClient: 0 });
        });

    } catch (error) {
      return res.status(500).json({ error: "erreur cote back-end", error });
    }

  },
  tauxClientFidele: async (req, res) => {


    

    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    if (userId < 0) {
      return res.status(400).json({ error: "connection perdu" });
    }

    try {

      const structure = await models.Structure.findOne({ where: { id: userId } });
      if (!structure) {
        return res.status(401).json({ error: " Utilisateur introuvable " });
      }
      
      const client = await models.Client.count({
        where: { structureId:structure.id,
          bonus: {
            [Op.gte]: 1 // Sélectionner les clients avec un bonus supérieur ou égal à 1
          }
        },

      })

      const nbrClient = await models.Client.count({
        where: { structureId:structure.id},

      })

      if (!nbrClient) { 
        return res.status(405).json({ erreur: "elements manquant" })
      }
       
      
      const pourcentageClient = ( client / nbrClient) * 100;

       return res.status(201).json({ pourcentageClient: pourcentageClient })

    } catch (error) {
      return res.status(500).json({ error: "erreur cote back-end", error });
    }

  },
}
