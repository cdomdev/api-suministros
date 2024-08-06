export const requireToken = (req, res, next) => {
  console.log(req.user);
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Acceso no autorizado" });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: "No hay datos en el header " });
  }
};
