//les importations 
let express = require("express");

const structureCtrl = require("./routes/structureCtrl");
const models = require ("./models");
const utilisateurCtrl = require("./routes/utilisateurCtrl");
const clientCtrl = require("./routes/clientCtrl");

//router
exports.router = (() => {
    let apiRouter = express.Router();
// routes propre a la structure ................................
    apiRouter.route('/structure/login/').post(structureCtrl.login);
    apiRouter.route('/structure/client/create/').post(structureCtrl.createClient);
    apiRouter.route('/structure/profile/').get(structureCtrl.getProfile);
    apiRouter.route('/structure/detailClient/:id').get(structureCtrl.detailClient);
    apiRouter.route('/structure/listClient/').get(structureCtrl.getAllClient);
    
    // route propre a l'utilisateur .....................................

    apiRouter.route('/utilisateur/login/').post(utilisateurCtrl.login);
    apiRouter.route('/utilisateur/createStructure/').post(utilisateurCtrl.createStructure);
    apiRouter.route('/utilisateur/createUtilisateur/').post(utilisateurCtrl.createUtilisateur);
    apiRouter.route('/utilisateur/profile/').get(utilisateurCtrl.getProfile);
    apiRouter.route('/utilisateur/listStructure/').get(utilisateurCtrl.getAllStructure);
    apiRouter.route('/utilisateur/listCommercial/').get(utilisateurCtrl.getAllCommercial);
    apiRouter.route('/utilisateur/statutChange/:id').put(utilisateurCtrl.onOffStatutCommercial);
    apiRouter.route('/structure/statutChange/:id').put(utilisateurCtrl.onOffStatutStructure);
    apiRouter.route('/utilisateur/editCommercial/:id').put(utilisateurCtrl.editCommercial);
    apiRouter.route('/utilisateur/editStructure/:id').put(utilisateurCtrl.editStructure);
    apiRouter.route('/utilisateur/detailCommercial/:id').get(utilisateurCtrl.detailCommerciale);
    apiRouter.route('/utilisateur/detailStructure/:id').get(utilisateurCtrl.detailStructure);
    
    // route supplementaires ..................................
    apiRouter.route('/activite/create/').post(utilisateurCtrl.addActivite);
    apiRouter.route('/roles').get(utilisateurCtrl.getAllRole);
    apiRouter.route('/commercial').get(utilisateurCtrl.getCommercial);
    apiRouter.route('/activites').get(structureCtrl.getAllActivite);

    //route propres au client ......................................................
    apiRouter.route('/client/validation/:id').put(clientCtrl.validation);


    return apiRouter;
})();