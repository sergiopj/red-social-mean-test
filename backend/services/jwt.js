const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_curso-red-social';

// para generar jason web tokens
exports.generateJWT =  (user) => {
  return new Promise(async (resolve, reject) => {
    const payload = {
      sub: user._id,
      name: user.name,
      surname: user.surname,
      nick: user.nick,
      email: user.email,
      role: user.role,
      image: user.image,
      iat: moment().unix(), // fecha actual de creacion del token
      exp: moment().add(30, 'days').unix(), // expiracion del token
    };

    // generamos el token
    const jasonwbt = jwt.encode(payload, secret);

    jasonwbt
      ? resolve(jasonwbt)
      : reject(new Error("No se ha podido generar el jwt"));
  });
};

