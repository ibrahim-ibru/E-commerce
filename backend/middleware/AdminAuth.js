// backend/middleware/AdminAuth.js
import pkg from "jsonwebtoken";
const { verify } = pkg;

export default async function AdminAuth(req, res, next) {
    try {
        const key = req.headers.authorization;
        if (!key)
            return res.status(403).send({ msg: "Unauthorized access" });
        
        const token = key.split(" ")[1];
        const auth = await verify(token, process.env.ADMIN_JWT_KEY);
        
        if (!auth.isAdmin) {
            return res.status(403).send({ msg: "Access denied: Admin privileges required" });
        }
        
        req.admin = auth;
        next();
    } catch (error) {
        return res.status(403).send({ msg: "Session expired, please log in again" });
    }
}

