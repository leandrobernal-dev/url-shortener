import mongoose, { Schema, model, models } from "mongoose";

const userDb = mongoose.connection.useDb("users");

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: [true, "Email Already Exist!"],
        },
        password: String,
        provider: {
            type: String,
            default: "credentials",
        },
    },
    { timestamps: true }
);

const User = models.users || userDb.model("users", userSchema);

export default User;
