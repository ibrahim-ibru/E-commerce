import { Router } from "express";
import * as user from "./requesthandler/user.requesthandler.js";
import * as admin from "./requesthandler/admin.requesthandler.js";

const router = Router();

// Admin
router.post("/adminlogin", admin.adminlogin);
router.post("/createadmin", admin.createAdmin);

// User
router.post("/userregistration", user.userRegistration);
router.post("/userlogin", user.userlogin);
router.get("/getuser/:id", user.getUser);
export default router;