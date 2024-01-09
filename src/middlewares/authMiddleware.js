const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    let authorization = req.headers.authorization
    if (!authorization) {
      return res.status(403).send({status: false,  message: "No 'Authorization' token provided!" });
    }
  const token = req.header('Authorization');

  if (!token) {
    console.log('Token not found in the request header');
    return res.status(401).json({ message: 'Authentication failed' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Error in verifying token');
      return res.status(403).json({ message: 'Invalid token' });
    }

    // If verification is successful, attach the user information to the request object
    req.user = user;
    next(); // Move on to the next middleware or route handler
  });
};


exports.verifyToken = (req, res, next) => {
  try {
    let authorization = req.headers["x-authenticated-user"]
    if (!authorization) {
      return res.status(403).send({status: false,  message: "X-Authenticated-User token is required!" });
    }
    const token = authorization.split(' ')[1]
    if(!token) return res.status(403).send({status: false,  message: "X-Authenticated-User token is required!" });

    jwt.verify(token, config.access_token_secret, (err, decoded) => {
      if (err) {
        console.log(err)
        return res.status(401).send({status: false,  message: "Unauthorized X-Authenticated-User!" });
      }

      if(decoded){
        req.user_id = decoded.id;
        next();
      }else{
        res.status(400).send({status: false,  message: "X-Authenticated-User not found!" });
        return;
      }

    });

  } catch (error) {
    return res.status(500).send({status: false, message: error})
  }
};