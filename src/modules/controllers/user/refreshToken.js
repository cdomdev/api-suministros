import { generateAccessToken } from "../../middleware/createToken.js";
import { User } from "../../models/usersModels.js";
import jwt from "jsonwebtoken";

const secretRefresToken = process.env.CLAVE_FOR_TOKEN_REFRESH;

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  console.log("cabecera token --->", refreshToken);
  if (!refreshToken) return res.sendStatus(401);

  try {
    const user = await User.findOne({ where: { refreshToken: refreshToken } });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Refresh token no válido" });
    }

    const decoded = jwt.verify(refreshToken, secretRefresToken);
    if (!decoded) {
      return res.status(403).json({ message: "Refresh token no válido" });
    }

    const newAccessToken = generateAccessToken(user);

    console.log("nuevo token .-----> ", newAccessToken);
    res
      .status(200)
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 15,
      })
      .json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    console.error("Error al renovar el access token:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
