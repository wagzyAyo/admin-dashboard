const mongoose = require("mongoose")

const schema = mongoose.Schema(
    {
        name:{
            type: String,
            require: true,
        },
        amount: {
            type: Number,
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