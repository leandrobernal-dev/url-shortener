import mongoose, { Schema } from "mongoose";

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

const Folder = foldersDb.model("Folders", FolderSchema);
export default Folder;
