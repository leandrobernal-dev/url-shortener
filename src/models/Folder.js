import mongoose, { Schema } from "mongoose";
import Url from "./Url";

const foldersDb = mongoose.connection.useDb("Folders");

const FolderSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

FolderSchema.virtual("urls", {
    ref: Url,
    localField: "_id",
    foreignField: "folder",
});

const Folder = foldersDb.model("Folders", FolderSchema);
export default Folder;
