import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
        },
        password: String,
        provider: {
            type: String,
            default: "credentials",
        },
    },
    { timestamps: true }
);

const User = models.user || model("user", userSchema);

export default User;
