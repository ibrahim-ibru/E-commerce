import adminSchema from "../model/model.admin.js";
import bcrypt from "bcrypt";

async function adminlogin(req, res) {
    const { email, password } = req.body;
    console.log(email, password);

    if (!(email && password)) {
        return res.status(400).send({ message: "fill the fields" });
    }

    try {
        const data = await adminSchema.findOne({ email });

        if (!data) {
            return res.status(401).send({ message: "admin not found" });
        }

        const hpassword = data.hpassword;
        const result = await bcrypt.compare(password, hpassword);

        if (result) {
            return res.status(200).send({ message: "login successful" });
        } else {
            return res.status(401).send({ message: "wrong password" });
        }

    } catch (error) {
        res.status(500).send({ message: "Something went wrong" });
    }
}

async function createAdmin(req, res) {
    const { email, password } = req.body;
    console.log(email, password);

    if (!(email && password)) {
        return res.status(400).send({ message: "fill the fields" });
    }

    try {
        const data = await adminSchema.findOne({ email });

        if (data) {
            return res.status(400).send({ message: "admin already exists" });
        }

        const hpassword = await bcrypt.hash(password, 10);
        await adminSchema.create({ email, hpassword });

        return res.status(200).send({ message: "admin created" });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong" });
    }
}

export { adminlogin, createAdmin };
