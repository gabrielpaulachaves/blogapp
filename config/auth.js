//essa é a "estrategia" que usaremos para fazer o login (estrategia é um meio para fazer login, pode ser, por exemplo, usando o google)
const local = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

require("../models/user")
const user = mongoose.model("usuario")

module.exports = function(passport){
        //aqui estou dizendo qual será o campo que será analisado (no meu caso, o login do usuario é baseado no email, ou seja, cada usuario possui um email diferente e é ele que permitirá login). Já o done é a resposta para aquela busca
    passport.use(new local({usernameField: "email"}, (email, senha, done)=>{

        user.findOne({email: email}).then(usuario =>{
            //para entender essa linha é o seguinte: se o usuario nao existe, entao vai retornar uma callback com null(no caso, seria os dados que nao existem), o false(para representar se a conta foi autenticada, mas nesse caso nao foi), e no final uma mensagem 
            //ou seja, baiscamente nessas primeiras linhas ele vai buscar no banco de dados e ver se o email passado no login existe, aqui já passamos o codigo de resposta caso nao exista. 
            if(!usuario){
                return done(null, false, {message: "Conta não encontrada"})
            }
            //agora, se a conta existe(email), iremos verificar se a senha passada é a mesma do banco de dados
                                                    //primeiro parametro para erro, segundo para acerto
            bcrypt.compare(senha, usuario.senha, (erro, iguais)=>{
                //se as senhas sao iguais
                if(iguais){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "senha incorreta"})
                }
            })
        })
    }))

    //isso guarda os dados do usuario em uma sessao
    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })
    passport.deserializeUser((id, done)=>{
        user.findById(id, (err, usuario)=>{
            done(err, user)
        })
    })
}