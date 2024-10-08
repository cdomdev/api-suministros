import { ErrorServer, ForbiddenError, NotFountError, UnauthorizedError } from "../../helpers/errorsInstances.js";
import { refreshTokenUser } from "../../helpers/userHelpers/authHelper.js";
const secretRefresToken = process.env.CLAVE_FOR_TOKEN_REFRESH;


export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  try {

    const newAccessToken = await refreshTokenUser(refreshToken, secretRefresToken)

    res
      .status(200)
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60,
      })
      .json({ success: true });


  } catch (error) {
    console.error("Error al renovar el access token:", error);
    if (error instanceof UnauthorizedError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else if (error instanceof ForbiddenError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else if (error instanceof NotFountError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    }

    return res.status(500).json({ error: new ErrorServer().message });
  }
};
