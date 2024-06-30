export const logout = (re, res) => {
  res.clearCookie("access_token").json({ message: "Logout succes" });
};
