const mongoose = require("mongoose")

const schema = mongoose.Schema

const cat = new schema({
    nome: {
        type: String,
        required: true
    },
    slug:{
        type: String,
        require: true
    },
    date:{
        type: Date,
        default: Date.now() //esse default serve para passar um valor padrão
    }
})

mongoose.model('categorias', cat)


