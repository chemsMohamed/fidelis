//les iportations
let jwt = require("../utils/jwToken");
let bcrypt = require("bcryptjs");
let models = require("../models");
const { where } = require("sequelize");

//constante....
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

//routres

module.exports = {
  login: async (req, res) => {
    // Params
    const email = req.body.email;
    const password = req.body.password;

    // Check for missing parameters
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: " parametre manquants" });
    }

    try {
      // Find user by email
      const utilisateur = await models.Utilisateur.findOne({ where: { email: email } });

      if (!utilisateur) {
        return res.status(404).json({ error: " utilisateur n'existe pas " });
      }


      // Compare password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, utilisateur.motDePasse);

      if (!isPasswordValid) {
        return res.status(403).json({ error: "mot de passe incorect " });
      }

      if (utilisateur.statut == false) {
        return res.status(402).json({ error: " votres compte est bloquer contacter votre administrateur  " });
      }

      const role = await models.Role.findOne({ where: { id: utilisateur.roleId } })




      // Generate token and send successful response
      const token = jwt.generateTokenForUser(utilisateur);
      return res.status(201).json({
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        phone: utilisateur.numeroTel,
        email: utilisateur.email,
        token,
        role: role.role,

      });
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({ error: " erreur cote serveur" });
    }
  },
  edtitMotDePasse: async (req, res) => {

    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);
   
    // Params
    const holdMotDePasse = req.body.holdMotDePasse;
    const newMotDePasse = req.body.newMotDePasse;
    const verifMotDePasse = req.body.verifMotDePasse;

    // Check for missing parameters
    if (!PASSWORD_REGEX.test(holdMotDePasse)) {
      return res.status(406).json({
        error: "Ancien mot de passe invalide (doit avoir une longueur de 4 à 8 et inclure 1 chiffre )",
      });
    }
    if (!PASSWORD_REGEX.test(newMotDePasse)) {
      return res.status(400).json({
        error: "Nouveau mot de passe invalide (doit avoir une longueur de 4 à 8 et inclure 1 chiffre )",
      });
    }
    if (!PASSWORD_REGEX.test(verifMotDePasse)) {
      return res.status(405).json({
        error: "verification mot de passe invalide (doit avoir une longueur de 4 à 8 et inclure 1 chiffre )",
      });
    }
    
    if (userId < 0) {
      return res.status(401).json({ error: "connection perdu" });
    }

    try {
      // Find user by email
      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!utilisateur) {
        return res.status(404).json({ error: " Utilisateur Introuvable " });
      }
      // Compare password using bcrypt
      const isPasswordValid = await bcrypt.compare(holdMotDePasse, utilisateur.motDePasse);

      if (!isPasswordValid) {
        return res.status(403).json({ error: " Ancien mot de passe n'est pas correct " });
      }

      if (newMotDePasse == verifMotDePasse) {
        bcrypt.hash(newMotDePasse, 5, (err, bcryptedPassword) => {
          utilisateur.update({
            motDePasse:bcryptedPassword,
          })
          return res.status(200).json({ message: "mot de passe modifier ! " });
        });
      } else {
        return res.status(402).json({ error: " la verfication du nouveau mot de passe est incorrect  " });
      }



    } catch (error) {

      return res.status(500).json({ error: " impossible de connecter l'utilisateur " });
    }
  },
  createUtilisateur: async (req, res) => {
    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var numeroTel = req.body.numeroTel;
    var code = req.body.code;
    var sexe = req.body.sexe;
    var email = req.body.email;
    var motDePasse = req.body.motDePasse;
    var roleId = req.body.roleId;

    if (userId < 0) {
      return res.status(400).json({ error: "connection perdu" });
    }

    if (!nom || !prenom || !numeroTel || !email || !motDePasse || !sexe) {
      return res.status(401).json({ error: "paramètres manquants" });
    }
    if (!PASSWORD_REGEX.test(motDePasse)) {
      return res.status(403).json({
        error: "mot de passe invalide (doit avoir une longueur de 4 à 8 et inclure 1 chiffre )",
      });
    }
    try {
      const admin = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!admin) {
        return res.status(404).json({ error: "Utilisateur Introuvable " });
      }

      const numeroExiste = await models.Utilisateur.findOne({ where: { numeroTel: numeroTel } });
      if (numeroExiste) {
        return res.status(402).json({ error: " Ce Numero Existe Deja " });
      }

      const UtilisateurExist = await models.Utilisateur.findOne({ where: { email: email } });
      if (UtilisateurExist) {
        return res.status(405).json({ error: " utilisateur existe deja dans la base de donnee " });
      }


      function generateUniqueCode() {
        // Génère un nombre aléatoire entre 10000 et 99999 (5 chiffres)
        const code = Math.floor(Math.random() * 90000) + 10000;
        return code.toString();
      }


      if (generateUniqueCode()) {


        const codeExistant = await models.Utilisateur.findOne({ where: { code: generateUniqueCode() } });

        while (codeExistant != null) {

          generateUniqueCode();

        }


        bcrypt.hash(motDePasse, 5, async (err, bcryptedPass) => {
          const utilisateur = await models.Utilisateur.create({

            nom: nom,
            prenom: prenom,
            numeroTel: numeroTel,
            sexe: sexe,
            code: generateUniqueCode(),
            email: email,
            motDePasse: bcryptedPass,
            roleId: roleId,

          })
          if (utilisateur) {
            return res.status(201).json("nouveau utilisateur  ajouter =>>>   " + utilisateur.code);
          }

        });


      }
    } catch (err) {
      console.error("Erreur lors de la récupération du test :", err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
  createStructure: async (req, res) => {

    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    var nom = req.body.nom;
    var nomBoss = req.body.nomBoss;
    var numeroTel = req.body.numeroTel;
    var logo = req.body.logo;
    var localisation = req.body.localisation;
    var codeCommercial = req.body.codeCommercial;
    var limite = req.body.limite;
    var typeInterventionId = req.body.typeInterventionId;
    var activiteId = req.body.activiteId;


    if (userId < 0) {
      return res.status(400).json({ error: "connection perdu" });
    }

    if (!nom || !numeroTel || !nomBoss || !localisation || !codeCommercial) {
      return res.status(401).json({ error: "parametres manquants" });
    }
    try {

      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!utilisateur) {
        return res.status(404).json({ error: "Utilisateur Introuvable" });
      }

      const numeroExiste = await models.Structure.findOne({ where: { numeroTel: numeroTel } });
      if (numeroExiste) {
        return res.status(402).json({ error: " Ce Numero Existe Deja " });
      }


      function generateUniqueCode() {
        // Génère un nombre aléatoire entre 10000 et 99999 (5 chiffres)
        const code = Math.floor(Math.random() * 90000) + 10000;
        return code.toString();
      }


      if (generateUniqueCode()) {


        const codeExistant = await models.Structure.findOne({ where: { codeUnique: generateUniqueCode() } })

        while (codeExistant != null) {

          generateUniqueCode()
        }


        const structure = await models.Structure.create({
          utilisateurId: userId,
          nom: nom,
          nomBoss: nomBoss,
          numeroTel: numeroTel,
          localisation: localisation,
          codeUnique: generateUniqueCode(),
          codeCommercial: codeCommercial,
          limite: limite,
          logo: logo,
          typeInterventionId: typeInterventionId,
          activiteId: activiteId,
        })
        if (structure) {
          return res.status(201).json("Nouvelle Structure cree avec success   =>>>  " + structure.codeUnique);
        }

      }
    } catch (err) {
      console.error("Error retrieving test:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getProfile: async (req, res) => {

    // Récupération des informations d'authentification
    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    if (userId < 0) {
      return res.status(400).json({ error: "connection perdu" });
    }

    try {
      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      const role = await models.Role.findOne({ where: { id: utilisateur.roleId } });
      if (!utilisateur) {
        return res.status(404).json({ error: "utilisateur introuvable ", userId });
      }

      return res.status(201).json({
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        sexe: utilisateur.sexe,
        numeroTel: utilisateur.numeroTel,
        email: utilisateur.email,
        date: utilisateur.createdAt,
        statut: utilisateur.statut,
        role:role.role,
      });
    } catch {
      return res.status(404).json({ error: "erreur cote back-end " });
    }
  },
  getAllStructure: async (req, res) => {
    //getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    try {

      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!utilisateur) {
        return res.status(404).json({ error: "utilisateur introuvable" });
      }

      let fields = req.query.fields;
      let limit = parseInt(req.query.limit);
      let offset = parseInt(req.query.offset);
      let order = req.query.order;

      models.Structure.findAll({
        order: [order != null ? order.split(":") : ["id", "ASC"]],
        attributes: fields !== "*" && fields != null ? fields.split(",") : null,
        limit: !isNaN(limit) ? limit : null,
        offset: !isNaN(offset) ? offset : null,
        include: [
          {
            model: models.Activite,
            attributes: ["domaine"],
          },
        ],
      })
        .then((userfond) => {
          return res.status(201).json({
            allUser: userfond

          });
        })
        .catch((error) => {
          return res.status(404).json({ error: "structure introuvable " });
        });
    } catch (error) {
      return res.status(404).json({ error: "erreur cote back-end" });
    }
  },
  getAllCommercial: async (req, res) => {
    //getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    if (userId < 0) {
      return res.status(400).json({ error: "connection perdu" });
    }

    try {

      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!utilisateur) {
        return res.status(404).json({ error: "utilisateur introuvable" });
      }

      let fields = req.query.fields;
      let limit = parseInt(req.query.limit);
      let offset = parseInt(req.query.offset);
      let order = req.query.order;

      models.Utilisateur.findAll({
        where: ({ roleId: 2 }),
        order: [order != null ? order.split(":") : ["id", "ASC"]],
        attributes: fields !== "*" && fields != null ? fields.split(",") : null,
        limit: !isNaN(limit) ? limit : null,
        offset: !isNaN(offset) ? offset : null,
        include: [
          {
            model: models.Role,
            attributes: ["role"],
          },
        ],
      })
        .then((userfond) => {
          return res.status(201).json({
            allCommercial: userfond

          });
        })
        .catch((error) => {
          return res.status(404).json({ error: "pas d'utilisateur trouvé ", error });
        });
    } catch (error) {
      return res.status(404).json({ error: "erreur cote back-end" });
    }
  },
  onOffStatutStructure: async (req, res) => {
    //getting auth header

    var id = req.params.id;

    try {
      // const userfond = await models.User.findOne({ where: { id: userId } });
      // if (!userfond) {
      //   return res.status(404).json({ error: "user not found ", userId });
      // }
      const structure = await models.Structure.findOne({ where: { id: id } });
      if (!structure) {
        return res.status(404).json({ error: "Structure introuvable" });
      }
      console.log(!structure.statut);

      await structure
        .update({
          statut: !structure.statut, // Inverse la valeur de status en un booléen
        })
        .then(() => {
          if (structure.statut == true) {

            return res.status(201).json(" Statut Active ");

          } else {

            return res.status(201).json(" Statut Desactive ");
          }
        })
        .catch((error) => {
          return res.status(500).json({ error: "Impossible de Modifier La Structure", error });
        });
    } catch {
      return res.status(404).json({ error: "erreur cote back-end " });
    }
  },
  onOffStatutCommercial: async (req, res) => {
    //getting auth header

    var id = req.params.id;

    try {
      // const userfond = await models.User.findOne({ where: { id: userId } });
      // if (!userfond) {
      //   return res.status(404).json({ error: "user not found ", userId });
      // }
      const utilisateur = await models.Utilisateur.findOne({ where: { id: id } });
      if (!utilisateur) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }
      console.log(!utilisateur.statut);

      await utilisateur
        .update({
          statut: !utilisateur.statut, // Inverse la valeur de status en un booléen
        })
        .then(() => {

          if (utilisateur.statut == true) {

            return res.status(201).json(" Statut activee ");

          } else {

            return res.status(201).json(" Statut desactive ");
          }
        })
        .catch((error) => {
          return res.status(500).json({ error: "impossible de modifier l'utilisateur", error });
        });
    } catch {
      return res.status(404).json({ error: "erreur cote back-end " });
    }
  },
  editStructure: async (req, res) => {
    //evoie des autorisation en entete 

    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    var nom = req.body.nom;
    var nomBoss = req.body.nomBoss;
    var localisation = req.body.localisation;
    var numeroTel = req.body.numeroTel;
    var typeInterventionId = req.body.typeInterventionId;

    var id = req.params.id;


    if (!nom || !numeroTel || !nomBoss || !localisation) {
      return res.status(400).json({ error: "Parametres Manquants" });
    }

    try {

      const admin = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!admin) {
        return res.status(404).json({ error: "Utilisateur Introuvable " });
      }

      const structure = await models.Structure.findOne({ where: { id: id } });
      if (!structure) {
        return res.status(404).json({ error: " Structure Selectionner N'existe Pas " });
      } else {


        await structure.update({

          nom: nom ? nom : structure.nom,
          nomBoss: nomBoss ? nomBoss : structure.nomBoss,
          localisation: localisation ? localisation : structure.localisation,
          numeroTel: numeroTel ? numeroTel : structure.numeroTel,
          typeInterventionId: typeInterventionId ? typeInterventionId : structure.typeInterventionId,


        })
          .then(() => {
            return res.status(201).json({ success: "structure Modifier" });
          })
          .catch((err) => {
            return res.status(500).json({ error: "erreur lors de la modification de la structure" });
          });


      }



    } catch (err) {
      console.error("Erreur lors de la récupération du test :", err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }


  },
  editCommercial: async (req, res) => {
    //evoie des autorisation en entete 

    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var numeroTel = req.body.numeroTel;
    var sexe = req.body.sexe;
    //var email = req.body.email;
    var roleId = req.body.roleId;

    var id = req.params.id;

    if (!nom || !prenom || !numeroTel || !sexe) {
      return res.status(400).json({ error: "paramètres manquants" });
    }

    try {

      const admin = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!admin) {
        return res.status(404).json({ error: "utilisateur introuvable " });
      }
      const UtilisateurExist = await models.Utilisateur.findOne({ where: { id: id } });
      if (!UtilisateurExist) {
        return res.status(404).json({ error: " utilisateur selectionner n'existe pas " });
      } else {
        // console.log("is ok ");


        await UtilisateurExist.update({

          nom: nom ? nom : UtilisateurExist.nom,
          prenom: prenom ? prenom : UtilisateurExist.prenom,
          numeroTel: numeroTel ? numeroTel : UtilisateurExist.numeroTel,
          sexe: sexe ? sexe : UtilisateurExist.sexe,
          roleId: roleId ? roleId : UtilisateurExist.roleId,

        })
          .then(() => {
            return res.status(201).json({ success: "Utilisateur Modifier !!" });
          })
          .catch((err) => {
            return res.status(500).json({ error: "erreur lors de la modification de l'utilisateur" });
          });


      }



    } catch (error) {
      console.error("Erreur lors de la récupération du test :", error);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }


  },
  getAllRole: async (req, res) => {

    let fields = req.query.fields;
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let order = req.query.order;

    const roles = await models.Role.findAll({

      order: [order != null ? order.split(":") : ["id", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,

    })

    if (roles) {
      return res.status(201).json({ roles: roles });
    }

  },
  getCommercial: async (req, res) => {

    let fields = req.query.fields;
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let order = req.query.order;

    const commercial = await models.Utilisateur.findAll({
      where: ({ roleId: 2 }),
      order: [order != null ? order.split(":") : ["id", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,

    })

    if (commercial) {
      return res.status(201).json({ commercial: commercial });
    }

  },
  getStructureFor: async (req, res) => {
    //getting auth header
    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);


    if (userId < 0) {
      return res.status(400).json({ error: "connection perdu" });
    }

    try {

      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!utilisateur) {
        return res.status(404).json({ error: "utilisateur introuvable" });
      }

      let fields = req.query.fields;
      let limit = parseInt(req.query.limit);
      let offset = parseInt(req.query.offset);
      let order = req.query.order;

      models.Structure.findAll({
        where: ({ codeCommercial: utilisateur.code }),
        order: [order != null ? order.split(":") : ["id", "ASC"]],
        attributes: fields !== "*" && fields != null ? fields.split(",") : null,
        limit: !isNaN(limit) ? limit : null,
        offset: !isNaN(offset) ? offset : null,
        include: [
          {
            model: models.Activite,
            attributes: ["domaine"],
          },
        ],
      })
        .then((structureFound) => {
          return res.status(201).json({
            structure: structureFound

          });
        })
        .catch((error) => {
          return res.status(404).json({ error: "structures introuvables " });
        });
    } catch (error) {
      return res.status(404).json({ error: "erreur cote back-end" });
    }
  },
  detailCommerciale: async (req, res) => {

    // Récupération des informations d'authentification
    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    var id = req.params.id;

    if (userId < 0) {
      return res.status(400).json({ error: "connection perdu", userId });
    }

    try {

      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!utilisateur) {
        return res.status(404).json({ error: "utilisateur introuvable " });
      }

      const commercial = await models.Utilisateur.findOne({ where: { id: id } });
      const nbrStructure = await models.Structure.findOne({ where: { codeUnique: commercial.code } });

      if (commercial) {
        return res.status(201).json({
          id: commercial.id,
          nom: commercial.nom,
          prenom: commercial.prenom,
          sexe: commercial.sexe,
          numeroTel: commercial.numeroTel,
          email: commercial.email,
          statut: commercial.statut,
          nbrStructure: nbrStructure,
        });
      } else {
        return res.status(404).json({ error: "Commercial introuvable " });
      }

    } catch {
      return res.status(404).json({ error: "erreur cote back-end " });
    }
  },
  detailStructure: async (req, res) => {

    // Récupération des informations d'authentification
    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    var id = req.params.id;

    if (userId < 0) {
      return res.status(400).json({ error: "connection perdu", userId });
    }

    try {

      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!utilisateur) {
        return res.status(404).json({ error: "utilisateur introuvable " });
      }



      const structure = await models.Structure.findOne({ where: { id: id } });

      const nbrClient = await models.Client.count({ where: { structureId: structure.id } });


      if (structure) {
        return res.status(201).json({
          id: structure.id,
          nom: structure.nom,
          nomBoss: structure.nomBoss,
          numeroTel: structure.numeroTel,
          localisation: structure.localisation,
          logo: structure.logo,
          statut: structure.statut,
          nbrClient: nbrClient,
          typeInterventionId: structure.typeInterventionId,

        });
      } else {
        return res.status(404).json({ error: "Structure introuvable " });
      }

    } catch {
      return res.status(404).json({ error: "erreur cote back-end " });
    }
  },
  addActivite: async (req, res) => {

    // Récupération des informations d'authentification
    var newActivite = req.body.activite;


    try {

      //const activiteExist = await models.Activite.findOne({ where: { domaine: newActivite } });
      

      const activiteExist = await models.Activite.findOne({ where: { domaine: newActivite } });
      if (!activiteExist) {
        const activite = await models.Activite.create({
          domaine: newActivite,
        })

        if (activite) {
          return res.status(201).json("Nouveau Domaine d'Activite Cree  " + activite.domaine);
        }
      } else {
        return res.status(400).json({ error: "Ce Domaine  D'activite Existe Deja" });
      }

    } catch {
      return res.status(500).json({ error: "erreur cote back-end " });
    }
  },
  getAllTypeIntervension: async (req, res) => {

    let fields = req.query.fields;
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let order = req.query.order;

    const typeIntervention = await models.TypeIntervention.findAll({

      order: [order != null ? order.split(":") : ["id", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,

    })

    if (typeIntervention) {
      return res.status(201).json({ typeIntervention: typeIntervention });
    }

  },

}