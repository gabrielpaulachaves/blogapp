//npm install --save express
//npm install --save express-handlebars
//npm install body-parser --save
//npm install --save mongoose

//24-06-2026, Como configurar sessões:
//npm install --save express-session
//npm instal --save connect-flash
const session = require("express-session")
const flash = require("connect-flash")

const express = require("express")
const {engine} = require("express-handlebars")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const admin = require("./routes/admin")
const path = require("path")


//configurações

//24-06-2026, configurando a sessao
app.use(session({ //aqui a gente cria a session, e na session criamos um objeto, com 3 propriedades
    secret: "sessionfraca", //chave para gerar uma sessao
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
//é importante que configurar o flash seja logo apos configurar a session

//middleware
app.use((req, res, next)=>{ //aqui vamos criar duas variaveis que poderemos acessar em qualquer parte da aplicacao, para criar, será res.locals."nome da variavel" = "valor"
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

app.engine("handlebars", engine({defaultLayout:"main"}))
app.set("view engine" ,"handlebars")

app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json()) 

//mongoose
mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/blogapp").then(()=>{
        console.log("mongoose conectado")
    }).catch((err)=>{
        console.log(err)
    })

//public
app.use(express.static(path.join(__dirname, "public")))  

app.use((req, res, next) =>{ //é assim que se cria um middleware, usa req, res e next, e no final do codigo da funcao, usar next()
    console.log("isso é um middleware")
    next()
})

//rotas
app.use("/admin", admin)

//porta
const port = 3333
app.listen(port, ()=>{
    console.log("Servidor ligado!")
})

