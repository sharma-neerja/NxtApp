let jwt = require('jsonwebtoken');


let authenticateUser = (req, res, next) => {
    let jwtToken;
    const authHeader = req.headers['authorization'];
    if (authHeader!==undefined){
        jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
        res.status(401);
        res.send('Invalid Access Token');
    }
    else{
        jwt.verify(jwtToken, "secret", (error, payload) => {
            if (error){
                res.status(401);
                res.send('Invalid Access Token');
            }
            else{
                req.email=payload.email;
                next();
            }
        });
    }
  };
  module.exports = {authenticateUser};
