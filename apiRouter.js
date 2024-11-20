//les importations 
let express = require("express");

const structureCtrl = require("./routes/structureCtrl");
const models = require ("./models");
const utilisateurCtrl = require("./routes/utilisateurCtrl");

//router
exports.router = (() => {
    let apiRouter = express.Router();
// routes propre a la structure ................................
    //apiRouter.route('/structure/create/').post(structureCtrl.create);
    apiRouter.route('/structure/login/').post(structureCtrl.login);
    //apiRouter.route('/structure/editProfile/').put(structureCtrl.updateProfile);
    apiRouter.route('/structure/profile/').get(structureCtrl.getProfile);
    apiRouter.route('/structure/listClient/').get(structureCtrl.getAllClient);
    
    // route propre a l'utilisateur .....................................
    apiRouter.route('/utilisateur/login/').post(utilisateurCtrl.login);
    apiRouter.route('/utilisateur/createStructure/').post(utilisateurCtrl.createStructure);
    apiRouter.route('/utilisateur/createUtilisateur/').post(utilisateurCtrl.createUtilisateur);
    apiRouter.route('/utilisateur/profile/').get(utilisateurCtrl.getProfile);
    apiRouter.route('/utilisateur/listStructure/').get(utilisateurCtrl.getAllStructure);
    apiRouter.route('/utilisateur/listCommercial/').get(utilisateurCtrl.getAllCommercial);
    apiRouter.route('/utilisateur/statusChange/:id').put(utilisateurCtrl.onOffStatus);
    apiRouter.route('/utilisateur/editCommercial/:id').put(utilisateurCtrl.editUtilisateur);
    apiRouter.route('/utilisateur/editStructure/:id').put(utilisateurCtrl.editStructure);



    return apiRouter;
})();