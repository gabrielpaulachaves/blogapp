const { text } = require("body-parser")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/user")
const user = mongoose.model("usuario")
const bcrypt = require("bcryptjs")


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


module.exports = router