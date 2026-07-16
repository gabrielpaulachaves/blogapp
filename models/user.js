const mongoose = require("mongoose")

const schema = mongoose.Schema

const user = new schema({
    usuario:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    admin:{
        type: Number,
        default: 0
    },
    senha:{
        type: String,
        required: true
    }
})

mongoose.model("usuario", user)

