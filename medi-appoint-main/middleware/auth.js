// const jwt = require("jsonwebtoken");
// // middle ware to autheticate the user 
// const auth = (req, res, next) => {
//   try {
//     // get the token 
//     const token = req.headers.authorization.split(" ")[1];
//     // verify the token 
//     const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
//     if (!verifyToken) {
//       return res.status(401).send("Token error");
//     }
//     // save the user in locals 
//     req.locals = verifyToken.userId;
//     next();
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

// module.exports = auth;
const jwt = require("jsonwebtoken");

// Middleware to authenticate the user
const auth = (req, res, next) => {
  try {
    // Get the token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send("Token missing");
    }

    // Verify the token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res.status(401).send("Invalid token");
    }

    // Save the user in locals
    req.locals = verifyToken.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

module.exports = auth;
