//npm install --save express
//npm install --save express-handlebars
//npm install body-parser --save
//npm install --save mongoose
//npm install --save bcryptjs
//npm install --save passport
//npm install passport-local


//24-06-2026, Como configurar sessões:
//npm install --save express-session
//npm instal --save connect-flash
const session = require("express-session")
const flash = require("connect-flash") //o flash é uma sessao, dura só uma vez e some quando o usuario recarrega a pagina

const express = require("express")
const {engine} = require("express-handlebars")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const admin = require("./routes/admin")
const user = require("./routes/usuario")
const path = require("path")
const passport = require("passport")

require("./models/Pos")
require("./models/Cat")
require("./config/auth")(passport) //passando a const passport como parametro para o arquivo auth
//configurações

const postagens = mongoose.model("postagens")
const categorias = mongoose.model("categorias")

//24-06-2026, configurando a sessao
app.use(session({ //aqui a gente cria a session, e na session criamos um objeto, com 3 propriedades
    secret: "sessionfraca", //chave para gerar uma sessao
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
//é importante que configurar o flash seja logo apos configurar a session

//middleware
app.use((req, res, next)=>{ //aqui vamos criar duas variaveis que poderemos acessar em qualquer parte da aplicacao, para criar, será res.locals."nome da variavel" = "chave"
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    //o flash armazena valor temporario usando chave (a chave é a ("success_msg")), a variavel vai guardar a chave req.flash, e essa chave vai procurar o valor pelo codigo.
    //Imagine a situação: req.flash("success_msg", "categoria criada"), entao o res.locals.success_msg vai procurar essa req.flash("success_msg") no codigo e seu valor será "categoria criada". Então para mostrarmos no handlebars, basta {{success_msg}}
    //a chave é essa "success_msg" dentro do req.flash, ai quando achar um valor nessa chave, a variavel .locals. vai receber esse valor
    next()

    //o middleware é como um intermediador que executa uma logica antes de dar a resposta de requisiçao ao cliente. Como por exemplo: uma tela de login antes de vc acessar o conteudo, se estiver logado, entao vai para a tela do conteudo, se nao estiver logado, vai pra tela de login.
    //ele nao é apenas para esses casos, um body-parser tbm é um middleware
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

//rotas

app.get("/", (req, res)=>{
    postagens.find().populate("categoria").sort({date:"desc"}).lean().then(postagens =>{
        res.render("index", {postagem: postagens})
    }).catch(err=>{
        req.flash("error_msg", "Erro ao exibir postagens")
        res.redirect("/404")
    })
})

app.get("/postagem/:slug", (req, res)=>{
    postagens.findOne({slug:req.params.slug}).populate("categoria").lean().then(postagem =>{
        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "Erro ao encontrar essa postagem")
            res.redirect("/")
        }
    }).catch(err =>{
        req.flash("error_msg", "erro 404")
        res.redirect("/404")
    })
})

app.get("/categoria", (req, res)=>{
    categorias.find().sort({date: "desc"}).lean().then(categoria =>{
        res.render("categoria/index", {categoria: categoria})
    }).catch(err =>{
        req.flash("error_msg", "erro ao listar categorias")
        res.redirect("/")
    })
})

app.get("/categoria/postagens/:id", (req, res)=>{
    
async function buscar() {

    try{
    const post = await postagens.find({categoria:req.params.id}).sort({date:"desc"}).lean()
    const cat = await categorias.findOne({_id: req.params.id}).lean()

    res.render("categoria/seusposts", {postagem: post, categoria: cat})  
}catch(err){
            req.flash("error_msg", "Erro ao exibir postagens referentes a essa categoria")
        res.redirect("/categoria")
}
}
buscar()})

app.get("/404", (req, res)=>{
    res.send("erro 404!")
})

app.use("/admin", admin)
app.use("/usuarios", user)
//isso é como um prefixo para acessar as rotas do arquivo importado

//porta
const port = 3333
app.listen(port, ()=>{
    console.log("Servidor ligado!")
})

