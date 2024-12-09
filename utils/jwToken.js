//les importations 

let jwt = require('jsonwebtoken');
const jwtSignSecret ='gdjaskajahhqu36278bshsys5s5v9sdhhs8ueucv'
//
module.exports={
    generateTokenForUser:(userData)=>{
        return jwt.sign({
            userId: userData.id,
            roleId: userData.roleId,
            numeroTel:userData.numeroTel
        },
         jwtSignSecret,
        {
            expiresIn: '10m'
        })
         
    },
    parseAuthorization:(authorization)=>{
        return (authorization != null)? authorization.replace('bearer','') :null;
    },
    getUserId:(authorization) => {
        var userId = -1;
        let token = module.exports.parseAuthorization(authorization); 
        if (token != null) {
            try {
                var jwtToken = jwt.verify(token, jwtSignSecret);
                if (jwtToken != null) {
                    userId = jwtToken.userId;
                }
            } catch (err) { }
        }
        return userId;
    }
    
    
}