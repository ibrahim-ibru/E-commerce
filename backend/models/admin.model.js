import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true }
});

export default mongoose.model.AdminDetails || mongoose.model("AdminDetail", adminSchema);
