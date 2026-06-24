const mongoose = require("mongoose")

const schema = mongoose.Schema
                        //esse schema é uma propriedade que define a estrutura da collection

const cat = new schema({ //aqui criamos a estrutura da nossa collection. 
    nome: {
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now() //esse default serve para passar um valor padrão
    }
})

//aqui criamos o model, usando a estrutura acima. Model = referencia de tabela no banco de dados
mongoose.model('categorias', cat)




