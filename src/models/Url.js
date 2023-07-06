import mongoose, { Schema } from "mongoose";
import Clicks from "./Clicks";

const urlsDb = mongoose.connection.useDb("Urls");

export const UrlSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
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
            required: false,
        },
        folder: {
            type: Schema.Types.ObjectId,
            ref: "Folder",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
UrlSchema.virtual("clicks", {
    ref: Clicks,
    localField: "_id",
    foreignField: "url",
    count: true,
});

const Url = urlsDb.model("Urls", UrlSchema);
export default Url;
