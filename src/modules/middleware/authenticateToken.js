import jwt from "jsonwebtoken";

const claveSecreta = process.env.CLAVE_FOR_ACCESS_TOKEN;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("auth validacion del token ---> ", token);
  if (token == null) {
    return res.status(401).json({
      success: false,
      message: "Token de autenticación no proporcionado",
    });
  }

  jwt.verify(token, claveSecreta, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Token inválido" });
    }
    req.user = decoded;
    next();
  });
};
