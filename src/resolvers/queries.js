const {list,nonNull,nullable,queryField, intArg, stringArg, arg} = require("nexus");
const {User, Product,ResUser,ResBasket, ResProduct, ResCommand, ResCategorie} = require('./models');
const prisma = require('../contexts');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Get All  (Modifier ces 2 la)
const Users = queryField("Users",{
    type : nullable(list(nonNull(User))),
    resolve: async (root,args) => {
        const result = await prisma.user.findMany()
        return result;
    }
})
// Avoir un User en particulier
const user = queryField("User",{
    type : nullable(ResUser),
    args: {
        id : nonNull(intArg())
    },
    resolve: async (root,args) => {

        const result = await prisma.user.findUnique({
            where:{
                id : args.id
            }
        })
        if (result != null){
        return {Statut : 200, Message: "Ca a fonctionné",data:[result]}
        }
        else return {Statut : 0 , Message : "Utilisateur non trouvé"}
    }
})

// Fonction Login
const Login = queryField("Login",{
    type: nullable(ResUser),
    args: {
        Email : nonNull(stringArg()),
        Password: nonNull(stringArg())
    },
    resolve: async(root,args,) => {
        const result = await prisma.user.findUnique({
            where: {
                Email: args.Email
            }
        })
        if (result == null){
            return {Statut : 0, Message : "Erreur lors de la recherche de mail"}
        }
        else{
            const result2 = bcrypt.compare(args.Password,result.Password)
            .then(res => {
                if(res){
                    const token = jwt.sign({id: result.id},process.env.TOKEN_SECRET_KEY,{expiresIn : '1d'})
                    return {Statut: 200, Message : "L'operation a reussi",Cookie: token,data : [result]}
                }
                else return {Statut : 0,Message : "Mot de passe non valide"}
            })
            .catch(err => {return {Statut: 0, Message: err}})
            .finally(mess => {
                return mess
            })
            return result2;
        }
    }
})

const verifyUser = queryField('VerifyUser',{
    type:nullable(ResUser),
    args:{
        Cookie : nonNull(stringArg())
    },
    resolve: async (root,args) => {
        try{
        jwt.verify(args.Cookie,process.env.TOKEN_SECRET_KEY)
        }
        catch(err){return {Statut : 0}}
        return {Statut : 200}
    }
})

const getBasket = queryField('Basket',{
    type: nullable(ResBasket),
    args:{
        id : nonNull(intArg())
    },
    resolve: async (root,args) => {
        try{
            const result = await prisma.basket.findUnique({
                where:{
                    id : args.id
                }
            })
            return {Statut: 200, Messsage : "Recuperation réussie",data : [result]}
        }
        catch(err){return {Statut: 0 , Message : err}}
    }
})
// Fonction pour avoir tous les Paniers de la db
const getBaskets = queryField('Baskets',{
    type:nullable(ResBasket),
    resolve: async (root,args) => {
        try{
            const result = await prisma.basket.findMany()
            return {Statut: 200, Message: "Recuperation des donnés ",data: result}
        }
        catch(err){return {Statut : 0 , Message : err}}
    }
})
// Fonctions pour les Produits 
const getProducts = queryField('Products',{
    type: nullable(ResProduct),
    resolve: async(root,args) => {
        try{
            const result = await prisma.product.findMany();
            return {Statut : 200 , Message : "Recuperation réussie",data :result}
        }
        catch(err){return {Statut : 0 , Message :err}}
    }
})
const getProduct = queryField('Product',{
    type: nullable(ResProduct),
    args: {
        id : nonNull(intArg())
    },
    resolve: async (root,args) => {
        try{
            const result = await prisma.product.findUnique({
                where:{
                    id : args.id
                }
            })
            return {Statut : 200, Message : "Reussite",data: [result]}
        }
        catch(err){return {Statut : 0,Message : err}}
    }
})

//
const getCommands = queryField('Commands',{
    type: nullable(ResCommand),
    args:{
        idUser : nonNull(intArg())
    },
    resolve: async (root,args) => {
        try{
            const result = await prisma.command.findMany({
                where:{
                    UserId: args.idUser
                }
            })
            return {Statut : 200, Message : "Recuperation des données réussie",data : result}
        }
        catch(err){return {Statut : 0,Message : err}}
    }
})

const getCategories = queryField('Categories',{
    type : nullable(ResCategorie),
    resolve: async (root,args) => {
        try{
            const result = await prisma.categorie.findMany({})
            return {Statut : 200, Message : "Recuperation des données réussie",data : result}
        }
        catch(err){return {Statut : 0, Message : err}}
    }
})
module.exports = {
    Users,user,Login,verifyUser,
    getBaskets,getBasket,
    getProduct,getProducts,
    getCommands,
    getCategories
}