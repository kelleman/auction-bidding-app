exports.authVerification = (req, res, next) => {
  try {
    let authorization = req.headers.authorization
    if (!authorization) {
      return res.status(403).send({status: false,  message: "No 'Authorization' token provided!" });
    }
    const token = authorization.split(' ')[1]
    if(!token) return res.status(403).send({status: false,  message: "'Authorization' token is required!" });

    jwt.verify(token, process.env.AUTH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err)
        return res.status(401).send({status: false,  message: "Unauthorized token!" });
      }
      next();
    });

  } catch (error) {
    return res.status(500).send({status: false, message: error})
  }
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