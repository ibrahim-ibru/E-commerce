import pkg from "jsonwebtoken";
const { verify } = pkg;


export async function Auth(req, res, next) {
    try {
        const key = req.headers.authorization;
        console.log(key);
        if (!key) {
            return res.status(401).send({ message: "Unauthorized" }); 
        }
        const token = key.split(" ")[1];
        const decoded = await verify(token, process.env.JWT_KEY);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).send({ message: "Something went wrong. Please try again later." });
    }
    
}