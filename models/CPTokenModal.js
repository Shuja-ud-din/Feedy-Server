import mongoose from "mongoose";

const CPTokenSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiration_time: {
        type: String,
        required: true
    }
})

const CPToken = mongoose.model('CPTokens', CPTokenSchema);

export default CPToken;