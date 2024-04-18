const mongoose = require("mongoose")

const schema = mongoose.Schema(
    {
        tag: String,
        name:{
            type: String,
            require: true,
        },
        amount: {
            type: String,
            require: true
        },
        size: {
            type: String,
            require: true
        },
        location: {
            type: String,
            require: true,
        },
        short: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: true,
        }
    },
    {
        timestamps: true,
    }
)

const propSchema = mongoose.model('property', schema)
module.exports = propSchema