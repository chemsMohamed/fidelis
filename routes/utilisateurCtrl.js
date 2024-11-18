//les iportations
let jwt = require("../utils/jwToken");
let bcrypt = require("bcryptjs");
let models = require("../models");

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
        .json({ error: "missing parameters" });
    }

    try {
      // Find user by email
      const utilisateur = await models.Utilisateur.findOne({ where: { email: email } });

      if (!utilisateur) {
      }

      // Compare password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, utilisateur.motDePasse);

      if (!isPasswordValid) {
        return res.status(403).json({ error: "invalid password" });
      }


      // Generate token and send successful response
      const token = jwt.generateTokenForUser(utilisateur);
      return res.status(201).json({
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        phone: utilisateur.phone,
        email: utilisateur.email,

        token,

      });
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).json({ error: "unable to verify user" });
    }
  },
  createStructure: async (req, res) => {
    var headerAuth = req.headers["authorization"];
    var userId = jwt.getUserId(headerAuth);

    var nom = req.body.nom;
    var numeroTel = req.body.numeroTel;
    var codeCommercial = req.body.codeCommercial;
    var roleId = req.body.roleId;
    var serviceId = req.body.serviceId;

    if (!nom || !numeroTel || !codeCommercial) {
      return res.status(400).json({ error: "missing parameters" });
    }
    try {
      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!utilisateur) {
        return res.status(404).json({ error: "utilisateur not found" });
      }


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
            utilisateurId: userId,
            nom: nom,
            numeroTel: numeroTel,
            codeUnique: generateUniqueCode(),
            codeCommercial: codeCommercial,
            roleId: roleId,
            serviceId: serviceId,
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
            utilisateurId: userId,
            nom: nom,
            numeroTel: numeroTel,
            codeUnique: generateUniqueCode4(),
            codeCommercial: codeCommercial,
            roleId: roleId,
            serviceId: serviceId,
          })
          if (structure) {
            return res.status(201).json("Nouvelle Structure cree avec success " + structure.codeUnique);
          }
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
      return res.status(400).json({ error: "wrong token" });
    }

    try {
      const utilisateur = await models.Utilisateur.findOne({ where: { id: userId } });
      if (!utilisateur) {
        return res.status(404).json({ error: "user not found ", userId });
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
        return res.status(404).json({ error: "utilisateur not found" });
      }
      
      let fields = req.query.fields;
      let limit = parseInt(req.query.limit);
      let offset = parseInt(req.query.offset);
      let order = req.query.order;

      models.Structure.findAll({
        where: { utilisateurId: userId },
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
            allUser:userfond
           
          });
        })
        .catch((error) => {
          return res.status(404).json({ error: "user not found " });
        });
    } catch (error) {
      return res.status(404).json({ error: "cannot find users" });
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
}