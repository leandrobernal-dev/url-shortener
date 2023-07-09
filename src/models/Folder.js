import mongoose, { Schema } from "mongoose";
import Url from "./Url";

const foldersDb = mongoose.connection.useDb("Folders");

const FolderSchema = new Schema(
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
        description: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

FolderSchema.virtual("urls", {
    ref: Url,
    localField: "_id",
    foreignField: "folder",
});

const Folder = foldersDb.model("Folders", FolderSchema);
export default Folder;
