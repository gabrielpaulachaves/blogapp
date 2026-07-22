const { text } = require("body-parser")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/user")
const user = mongoose.model("usuario")
const bcrypt = require("bcryptjs")
const passport = require("passport")


router.get("/registro", (req, res)=>{
    res.render("usuarios/reg")
})

router.post("/registro/nova", (req, res)=>{
    let erros = []
    if(!req.body.nome || req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Nome indefinido"})
    }
        if(!req.body.email || req.body.email == undefined || req.body.email == null){
        erros.push({texto:"Email indefinido"})
    }
        if(!req.body.senha || req.body.senha == undefined || req.body.senha == null || req.body.senha.length < 6){
        erros.push({texto:"Senha indefinida"})
    }
        if(req.body.senha != req.body.senha2){
           erros.push({texto:"Senhas diferentes, tente novamente!"}) 
        }
        if(erros.length > 0){
        res.render("usuarios/reg", {erros: erros})
    }
    else{
       user.findOne({email:req.body.email}).then(usuario =>{
        if(usuario){
            req.flash("error_msg", "Esse email já está cadastrado")
            res.redirect("/usuarios/registro")
        }
        else{

          const novoregistro = {
        usuario:req.body.nome,
        email:req.body.email,
        senha:req.body.senha
        }

            //esse gensalt serve para gerar um salt, que é o valor usado na criação do hash, e com o salt ele garante que senhas iguais gerem hashs diferentes
            //o 10 é o tempo para gerar o salt (quanto maior, mais trabalho o bycript levará para criar)
                            //parametro comum de callback (é possivel ver que, SE der erro, vai enviar um req.flash, se nao, continua e cria o hash)
        bcrypt.genSalt(10, (erro, salt) =>{
                        //aqui possuo: a senha, o salt. senha + salt = hash "aprimorado", e erro se der erro
            bcrypt.hash(novoregistro.senha, salt, (erro, hash)=>{
                if(erro){
                    req.flash("error_msg", "Houve um erro interno")
                    res.redirect("/usuarios/registro")
                }
                //a soma da senha + o salt gera um hash, a senha que será passada para o banco de dados será igual ao hash
                novoregistro.senha = hash

                new user(novoregistro).save().then(()=>{
             req.flash("success_msg", "Registro realizado com sucesso!")
             res.redirect("/")      
                }).catch(err =>{
                    req.flash("error_msg", "Houve um erro interno")
                    res.redirect("/usuarios/registro")
                })
            })
        })
        }
  }).catch(err =>{
                req.flash("error_msg", "Houve um erro interno")
        res.redirect("/usuarios/registro")  
       })
}
})

router.get("/login", (req, res)=>{
    res.render("usuarios/login")
})


//quem receberá esse post é o passport
//primeiro os dados que vieram do formulario com a rota para esse post foram para o body, e logo depois chega aqui e é passado para o passport, e entao ele joga para a funcao configurada no auth para a verificacao (ver se o dado existe ou nao)
//basicamente, o body-parser transformou o body em um objeto JS, para facilitar 
router.post("/login", (req, res, next)=>{
        //essa função que usaremos sempre que quisermos autenticar algo
    passport.authenticate("local", {
        //caminho que ele redirecionará caso autenticação tenha sido válida
        successRedirect: "/",
        //caminho que vai levar caso tenha dado errado
        failureRedirect: "/usuarios/login",
        //faz com que as mensagens de erro vao para uma variavel global chamada error (no qual tive que criar para funcionar)
        failureFlash: true
    })(req, res, next)

})


module.exports = router