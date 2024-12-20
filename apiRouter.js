//les importations 
//les importations 
//les importations 
//les importations 
//les importations 
let express = require("express");

const structureCtrl = require("./routes/structureCtrl");
const models = require ("./models");
const utilisateurCtrl = require("./routes/utilisateurCtrl");
const clientCtrl = require("./routes/clientCtrl");
const dashboadCtrl = require("./routes/dashboadCtrl");

//router
exports.router = (() => {
    let apiRouter = express.Router();
// routes propre a la structure ................................
    apiRouter.route('/structure/login/').post(structureCtrl.login);
    apiRouter.route('/structure/client/create/').post(structureCtrl.createClient);
    apiRouter.route('/structure/profile/').get(structureCtrl.getProfile);
    apiRouter.route('/structure/detailClient/:id').get(structureCtrl.detailClient);
    apiRouter.route('/structure/listClient/').get(structureCtrl.getAllClient);
    apiRouter.route('/structure/editClient/:id').put(structureCtrl.editClient);
    
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
    apiRouter.route('/utilisateur/commercial/structure').get(utilisateurCtrl.getStructureFor);
    apiRouter.route('/utilisateur/edtitMotDePasse').put(utilisateurCtrl.edtitMotDePasse);
    
    // route supplementaires ..................................
    apiRouter.route('/activite/create/').post(utilisateurCtrl.addActivite);
    apiRouter.route('/roles').get(utilisateurCtrl.getAllRole);
    apiRouter.route('/commercial').get(utilisateurCtrl.getCommercial);
    apiRouter.route('/activites').get(structureCtrl.getAllActivite);
    apiRouter.route('/typeIntervention').get(utilisateurCtrl.getAllTypeIntervension);

    //route propres au client ......................................................
    apiRouter.route('/client/validation/:id').put(clientCtrl.validation); 
    apiRouter.route('/client/intervention/:id').get(clientCtrl.nbrInterventionClient); 
    apiRouter.route('/client/validationType2/:id').put(clientCtrl.validationType2); 
    
    // route propres aux differents dashboard...........................................
    
    //dashboard de l'admin..............................................................

    apiRouter.route('/admin/structures').get(dashboadCtrl.countStructure);
    apiRouter.route('/admin/structures/salon').get(dashboadCtrl.countStructureSalon);
    apiRouter.route('/admin/structures/pressing').get(dashboadCtrl.countStructurePressing);
    apiRouter.route('/admin/utilisateur/commerciaux').get(dashboadCtrl.countCommerciaux);
    apiRouter.route('/admin/utilisateur/commerciaux/desactives').get(dashboadCtrl.countCommerciauxDesactives);
    apiRouter.route('/admin/utilisateur/commerciaux/actives').get(dashboadCtrl.countCommerciauxActives);
    apiRouter.route('/admin/structures/activees').get(dashboadCtrl.countStructureActivees);
    apiRouter.route('/admin/structures/desactivees').get(dashboadCtrl.countStructureDesactivees);
    apiRouter.route('/admin/utilisateur/bestCommercial').get(dashboadCtrl.bestCommercial);
    
    //dashboard de la structre....................................................................
    apiRouter.route('/structure/listClientFidels').get(dashboadCtrl.clientFidels);
    apiRouter.route('/structure/listClientEnAttente').get(dashboadCtrl.clientEnAttente);
    apiRouter.route('/structure/nbrClientFidels').get(dashboadCtrl.nbrClientFidels);
    apiRouter.route('/structure/nbrClientAleatoire').get(dashboadCtrl.nbrClientAleatoire);
    apiRouter.route('/structure/nbrClient').get(dashboadCtrl.nbrClientFor);
    apiRouter.route('/structure/tauxClientFidele').get(dashboadCtrl.tauxClientFidele);

    return apiRouter;
})();