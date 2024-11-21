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

    if (!nom || !prenom || !numeroTel || !email || !motDePasse || sexe) {
      return res.status(400).json({ error: "paramètres manquants" });
    }
    try {
      const admin = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!admin) {
        return res.status(404).json({ error: "utilisateur introuvable " });
      }
      const UtilisateurExist = await models.Utilisateur.findOne({ where: { email: email } });
      if (UtilisateurExist) {
        return res.status(404).json({ error: " utilisateur existe deja dans la base de donnee " });
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
    var activiteId = req.body.activiteId;

    if (!nom || !numeroTel || !nomBoss || !localisation || !codeCommercial) {
      return res.status(400).json({ error: "parametres manquants" });
    }
    try {
      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!utilisateur) {
        return res.status(404).json({ error: "utilisateur Introuvable" });
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
      if (!utilisateur) {
        return res.status(404).json({ error: "utilisateur introuvable ", userId });
      }

      return res.status(201).json({ utilisateur: utilisateur });
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
          return res.status(404).json({ error: "structure non trouvé " });
        });
    } catch (error) {
      return res.status(404).json({ error: "impossible de trouver des structure" });
    }
  },
  getAllCommercial: async (req, res) => {
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
          return res.status(404).json({ error: "pas d'utilisateur trouvé " });
        });
    } catch (error) {
      return res.status(404).json({ error: "impossible de trouver des utilisateur" });
    }
  },
  onOffStatus: async (req, res) => {
    //getting auth header

    var id = req.params.id;

    try {
      // const userfond = await models.User.findOne({ where: { id: userId } });
      // if (!userfond) {
      //   return res.status(404).json({ error: "user not found ", userId });
      // }
      const user = await models.User.findOne({ where: { id: id } });
      if (!user) {
        return res.status(404).json({ error: "cannot find user" });
      }
      console.log(!user.status);

      await user
        .update({
          status: !user.status, // Inverse la valeur de status en un booléen
        })
        .then(() => {
          return res.status(201).json("status changed" + user.status);
        })
        .catch((err) => {
          return res.status(500).json({ error: "cannot update user" });
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
    var statut = req.body.statut;


    var id = req.params.id;

    try {
      const admin = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!admin) {
        return res.status(404).json({ error: "utilisateur introuvable " });
      }
      const structure = await models.Structure.findOne({ where: { id: id } });
      if (!structure) {
        return res.status(404).json({ error: " structure selectionner n'existe pas " });
      } else {


        await structure.update({

          nom: nom ? nom : structure.nom,
          nomBoss: nomBoss ? nomBoss : structure.nomBoss,
          localisation: localisation ? localisation : structure.localisation,
          numeroTel: numeroTel ? numeroTel : structure.numeroTel,
          statut: statut ? statut : structure.statut, statut


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
  editUtilisateur: async (req, res) => {
    //evoie des autorisation en entete 

    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    var nom = req.body.nom;
    var prenom = req.body.prenom;
    var numeroTel = req.body.numeroTel;
    //var code = req.body.codeCommercial;
    var email = req.body.email;
    var motDePasse = req.body.motDePasse;
    var roleId = req.body.roleId;

    var id = req.params.id;

    try {
      const admin = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!admin) {
        return res.status(404).json({ error: "utilisateur introuvable " });
      }
      const UtilisateurExist = await models.Utilisateur.findOne({ where: { id: id } });
      if (!UtilisateurExist) {
        return res.status(404).json({ error: " utilisateur selectionner n'existe pas " });
      } else {
        console.log("is ok ");
        bcrypt.hash(motDePasse, 5, async (err, bcryptedPass) => {

          await UtilisateurExist.update({

            nom: nom ? nom : UtilisateurExist.nom,
            prenom: prenom ? prenom : UtilisateurExist.prenom,
            numeroTel: numeroTel ? numeroTel : UtilisateurExist.numeroTel,
            email: email ? email : UtilisateurExist.email,
            motDePasse: bcryptedPass ? bcryptedPass : UtilisateurExist.motDePasse,
            roleId: roleId ? roleId : UtilisateurExist.roleId,

          })
            .then(() => {
              return res.status(201).json({ success: "Utilisateur Modifier" });
            })
            .catch((err) => {
              return res.status(500).json({ error: "erreur lors de la modification de l'utilisateur" });
            });

        });
      }



    } catch (error) {
      console.error("Erreur lors de la récupération du test :", err);
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
      return res.status(201).json({roles: roles});
    }
    
  },
  getCommercial: async (req, res) => {

    let fields = req.query.fields;
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let order = req.query.order; 

    const commercial = await models.Utilisateur.findAll({
      where:({roleId:2}),
      order: [order != null ? order.split(":") : ["id", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,

    })

    if (commercial) {
      return res.status(201).json({commercial: commercial});
    }
    
  },
}