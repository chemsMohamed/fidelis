//les importations
let bodyParser = require("body-parser");
let express = require("express");
let apiRouter = require("./apiRouter").router
let cors = require('cors');

//instantiations des importés

let server = express();
//body-parser
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//CORS Configuration (Place at the top for optimal effect)
//CORS Configuration (Place at the top for optimal effect)
// server.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); 
//     res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });
const corsOptions = {
    origin:"http://localhost:3000",
    Credential:true,
    optionSuccessStatus:200
}
server.use(cors(corsOptions));
//configuration de la route 

server.get("/", (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.status(200).send('<h1>bienvenu dans mon SERVER  </h1>');
})

server.use("/api/fidelys/", apiRouter);

server.listen("3300", () => {
    console.log(" server lancer sur le port 3300 ;) ");
})
