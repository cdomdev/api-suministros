export const logout = (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json({ message: "Logout succes" });
  } catch (error) {
    console.log("Erro al finalizar la sesion ", error);
  }
};
