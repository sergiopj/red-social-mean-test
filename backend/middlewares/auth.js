

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_curso-red-social';


exports.ensureAuth = (req, res, next) => {

    // check token in header
    if (!req.headers.authorization) {
        return res.status(403).send({
            ok: false,
            message: 'Authorization header value is required'
        });
    }

    try {
        
        // clean token string se ha de recibir el token en la peticion
        const token = req.headers.authorization.replace(/['"]+/g, '');
        const payload = jwt.decode(token, secret);
        
       if(payload.exp <= moment.unix()) {
        return res.status(401).send({
            message: 'Token expired'
        })
       }

       req.user = payload;
       next();

    } catch (error) {
        return res.status(401).send({
            message: 'Invalid token'
        });
    }
};