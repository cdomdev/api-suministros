import { validatedUser } from "../../helpers/userHelper.js";
import { generateAccessToken, generateRefreshToken, } from "../../helpers/createTokensSesion.js";
import { MissingDataError, InvalidatedPasswordError, ErrorServer, UserNotFountError, UserExisting } from "../../helpers/errorsInstances.js";
import { conecction } from "../../../database/conecction.js";
import { createNewAdmin } from "../../helpers/adminHelper.js";


export const registerAdmin = async (req, res) => {
    const { nombre, email, password } = req.body
    const t = await conecction.transaction();

    try {

        if (!nombre || !email || !password) {
            throw new MissingDataError('Faltan datos para proceder con el registro')
        }

        await createNewAdmin(nombre, email, password, t);

        await t.commit();

        res.status(201).json({ message: 'success' });

    } catch (error) {
        await t.rollback();
        if (error instanceof MissingDataError) {
            return res.status(error.statusCode).json({ message: error.message });
        } else if (error instanceof UserExisting) {
            return res.status(error.statusCode).json({ message: 'Ya existe un administrador con esa informacion' });
        } else {
            console.error("Error en el registro de un nuevo usuario:", error);
            return res.status(500).json({ error: new ErrorServer().message });
        }
    }
}


export const loginAdmin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new MissingDataError('Faltan datos para proceder con el inicio de sesion')
    }

    try {

        const user = await validatedUser(email, password)

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();
        const userSessionData = JSON.stringify({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono,
            direccion: user.direccion,
            role: user.roles.rol_name,
            picture: user.picture
        });

        res
            .status(200)
            .cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 1000 * 60 * 60,
            })
            .cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24 * 7,
            })
            .cookie("user_sesion", userSessionData, {
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24 * 7
            })
            .cookie("token_sesion", accessToken, {
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24 * 7
            })
            .json({
                success: true,
                message: `OK`,
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                telefono: user.telefono,
                direccion: user.direccion,
                role: user.roles.rol_name,
                picture: user.picture
            });
    } catch (error) {
        if (error instanceof MissingDataError) {
            return res.status(error.statusCode).json({ message: error.message });
        } else if (error instanceof UserNotFountError) {
            return res.status(error.statusCode).json({ message: error.message });
        } else if (error instanceof InvalidatedPasswordError) {
            return res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error("Error en el controlador de inicio de sesión:", error);
            return res.status(500).json({ error: new ErrorServer().message });
        }
    }
};

export const logout = (req, res) => {
    try {
        res
            .status(200)
            .clearCookie("access_token")
            .clearCookie("refresh_token")
            .clearCookie("user_sesion")
            .json({ message: "Logout succes" });
    } catch (error) {
        console.log("Erro al finalizar la sesion ", error);
    }
};

