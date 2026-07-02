const mongoose = require("mongoose")

const schema = mongoose.Schema

const pos = new schema({
    titulo:{
        type: String,
        required: true
    },
     slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    }, //no campo "categoria", iremos fazer um relacionamento, para isso usamos  type: schema.Types.ObjectId que basicamente está dizendo que esse campo vai guardar o id de um objeto (e mongodb é um banco nao relacional, que lembra objetos). E quando criamos um campo desse tipo, precisamos passar uma referencia (usando ref) que será a collection que iremos fazer o relacionamento com a atual
    categoria:{
        type: schema.Types.ObjectId,
        ref: "categorias",
        required: true  
    },
    data:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", pos)


