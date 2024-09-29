import jwt from "jsonwebtoken";

const secretForToken = process.env.CLAVE_FOR_ACCESS_TOKEN;
const secretRefreshToken = process.env.CLAVE_FOR_TOKEN_REFRESH;

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.name, role: user.roles.rol_name },
    secretForToken,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.name, role: user.roles.rol_name },
    secretRefreshToken,
    { expiresIn: "1d" }
  );
};


