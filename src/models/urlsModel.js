import mongoose, { Schema, model, models } from "mongoose";

const urlsDb = mongoose.connection.useDb("urls");

const UrlSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: true,
        },
        shortenedUrl: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

const Url = models.urls || urlsDb.model("urls", UrlSchema);

export default Url;
