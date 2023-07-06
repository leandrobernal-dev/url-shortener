import mongoose, { Schema } from "mongoose";

const clicksDb = mongoose.connection.useDb("Clicks");

const ClickSchema = new Schema(
    {
        url: {
            type: Schema.Types.ObjectId,
            ref: "Url",
            required: true,
        },
        location: {
            type: String,
            required: false,
        },
        ip: {
            type: String,
            required: false,
        },
        os: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const Clicks = clicksDb.model("Clicks", ClickSchema);
export default Clicks;
