import { Router } from "express";
import * as user from "./requesthandler/user.requesthandler.js";
import * as admin from "./requesthandler/admin.requesthandler.js";
import * as product from "./requesthandler/product.requesthandler.js";
import { Auth } from "./middleware.js";

const router = Router();

// Admin
router.post("/adminlogin", admin.adminlogin);
router.post("/createadmin", admin.createAdmin);

// User
router.post("/userregistration", user.userRegistration);
router.post("/userlogin", user.userlogin);
router.get("/getuser",Auth, user.getUser);
router.post("/forgetpassword", user.forgetPassword);

// Product
router.post("/createproduct", product.addProduct);
export default router;