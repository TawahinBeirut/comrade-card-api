const {mutationField,resolve,nullable, stringArg, nonNull, intArg, arg, idArg} = require("nexus");
const {ResUser,User, ResBasket,ResProduct,ResCommand, Product,ResCategorie} = require("./models");
const prisma = require("../contexts");
const bcrypt = require('bcrypt');
const saltRounds = 10


// Créer un nouvel Utilisateur
const createUser = mutationField("Register",{
    type : nullable(ResUser),
    args: {
        Name : nonNull(stringArg()),
        Email : nonNull(stringArg()),
        Password : nonNull(stringArg())
    },
    resolve: async (root,args) => {
        const checkEmail = await prisma.user.findUnique({
            where:{
                Email: args.Email
            }
        })
        if (checkEmail == null){
        const result = 
        bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            return bcrypt.hash(args.Password,salt);
        })
        .then(async hash => {
            const result = await prisma.user.create({
                data:{
                    Name : args.Name,
                    Email : args.Email,
                    Password : hash
                }
            })
            // On ajoute un panier 
            await prisma.basket.create({
                data: {
                    id: result.id
                }
            })
            
            return {Statut: 200, Message : "Insertion des données réussi", data: [result]}
        })
        .catch(err => {
            return {Statut : 0, Message : err}
        })
        .finally(mess => {return mess})
        return result
    }
    else return {Statut : 0 ,Message : "Email déjà existant"}}

        
})

//Update un User 
const updateUser = mutationField("UpdateUser",{
    type: nullable(ResUser),
    args: {
        id : nonNull(intArg()),
        Name: nonNull(stringArg()),
        Password : nonNull(stringArg()),
        Score : nonNull(intArg())
    },  
    resolve: async (root,args) => {
        const result = await prisma.user.update({
            where:{
                id : args.id
            },
            data:{
                ...args
            }
        })
        return {Statut : 200, Message : "Modification des données réussie",data : [result]};
    }
})
// Delete un User
const deleteUser = mutationField(("DeleteUser"),{
    type: nullable(User),
    args: {
        id: nonNull(intArg())
    },
    resolve: async(root,args) => {
        const result = prisma.user.delete({
            where : {
                id: args.id
            }
        })
        return result
    }
})

// Delete tous les Users
const deleteAllUsers = mutationField("DeleteAllUsers",{
    type: nullable(ResUser),
    resolve: async(root,args) => {  
        const result = await prisma.user.deleteMany({})
        return {Statut : 200,Message : "Tous les Users sont supprimés"}
    }
})

// Fonction pour delete un Basket
const deleteBasket = mutationField('DeleteAllBaskets',{
    type:  nullable(ResBasket),
    resolve: async (root,args) => {
        try{
            const result = await prisma.basket.deleteMany({})
            return {Statut : 200,Message : "La supression des données a fonctionné",data: result}
        }
        catch(err){return {Statut : 0 ,Message : err}}
    }
})

// Fonctions pour les produits

// Fonction pour poster un produit
const postProduct = mutationField("PostProduct",{
    type: nullable(ResProduct),
    args: {
        Name: nonNull(stringArg()),
        Description : nonNull(stringArg()),
        Sellerid : nonNull(intArg()),
        idCategorie : nonNull(intArg())
    },
    resolve: async(root,args) => {
        try{
            const result = await prisma.product.create({
                data:{
                    Name: args.Name,
                    Description: args.Description,
                    SellerId: args.Sellerid,
                    idCategorie: args.idCategorie
                }
            })
            return {Statut : 200, Message : "L'Insertion des données a réussi",data: [result]}
        }
        catch(err){ return {Statut : 0, Message : err}}
    }
})
// Fonction pour Modifier un produit
const putProduct =  mutationField("PutProduct",{
    type: nullable(ResProduct),
    args: {
        id : nonNull(intArg()),
        Name: nonNull(stringArg()),
        Description: nonNull(stringArg())
    },
    resolve: async(root,args) => {
        try{
            const result = await prisma.product.update({
                where:{
                    id: args.id,
                },
                data:{
                    Name: args.Name,
                    Description: args.Description

                }
            })
            return {Statut: 200, Message : "La modification des données a echoué",data:[result]}
        }
        catch(err){
            return {Statut : 0 , Message : err}
        }
    }
})

// Fonction pour supprimer un produit
const deleteProduct = mutationField("DeleteProduct",{
    type: nullable(ResProduct),
    args:{
        id: nonNull(intArg())
    },
    resolve: async (root,args) => {
        try{
            const result = await prisma.product.delete({
                where:{
                    id: args.id
                }
            })
            return {Statut: 200,Message : "Le produit a bien été supprimé",data:[result]}
        }
        catch(err){return {Statut: 0, Message: err}}
    }
})

// Fonction pour modifier le statut de d'un produit
const putStatutProduct = mutationField("PutStatutProduct",{
    type: nullable(ResProduct),
    args:{
        id : nonNull(intArg()),
        NewStatut : nonNull(intArg())
    },
    resolve: async(root,args) => {
        // Verifier si le nb Statut est valable (1 2 ou 3)
        if (!(arg.id in (Object)[1,2,3])){
            return {Statut: 0, Message : "Le statut n'est pas valable"}
        }
        try{
            const result = await prisma.product.update({
                where:{
                    id: args.id 
                },
                data:{
                    Statut: args.NewStatut
                }
            })
            return {Statut : 200, Message: "Le Statut a bien été modifié", data:[Product]}
        }
        catch(err){return {Statut : 0 , Message : err}}
    }
})


// Fonction pour Incrementer/Decrementer le nombre de produits d'un Basket
const updateNbBaskets = mutationField("UpdateNbBaskets",{
    type: nullable(ResProduct),
    args:{
        id : nonNull(intArg()),
        Method : nonNull(intArg())
    },
    resolve: async (root,args) => {
        // On verifie que l'argument method est valable
        if (!(args.Method in (Object)[-1,1])){
            return {Statut : 0, Message : "Argument non valide"}
        }
        try{
            const result = await prisma.product.update({
                where:{
                    id : args.id
                },
                data:{
                    NbBaskets: {increment : args.id}
                }
            })
            return {Statut : 200, Message : "Le Nombre de paniers a bien été incrementé/decrementé",data:[Product]}
        }
        catch(err){return {Statut : 0, Message : err}}
    }
}) 

const deleteAllProducts = mutationField("DeleteAllProducts",{
    type: nullable(ResProduct),
    resolve: async (root,args) => {
        try{
            const result = await prisma.product.deleteMany({})
            return {Statut: 200, Message : "Tous les produits ont bien étés supprimés",data: result}
        }
        catch(err){return {Statut : 0, Message : err}}
    }
})

// Fonction pour poster une commande
const postCommand = mutationField("PostCommand",{
    type: nullable(ResCommand),
    args:{
        UserId : nullable(intArg())
    },
    resolve: async(root,args) => {
        try{
            const result = await prisma.command.create({
                data:{
                    UserId: args.id
                }
            })
            return {Statut : 200, Message : "La commande a bien été crée",data:[result]}
        }
        catch(err){return {Statut : 0 , Message : err}}
    }
})
// Fonction pour ajouter un produit à une commande
const addProductCommand = mutationField("AddProductCommand",{
    type: nullable(ResCommand),
    args:{
        id : nonNull(intArg()),
        idProduct : nonNull(intArg()) 
    },
    resolve: async (root,args) => {
        try{
            const result = await prisma.command.update({
                where:{
                    id : args.id
                },
                data:{
                    ProductsList:{
                        push: args.idProduct
                    }
                }
            })
            return {Statut : 200, Message :"Le Produit a bien eté rajouté",data: [result]}
        }
        catch(err){return {Statut : 0, Message : err}}
    }
})

const addProductBasket = mutationField("AddProductBasket",{
    type: nullable(ResBasket),
    args:{
        id : nonNull(intArg()),
        idProduct : nonNull(intArg()) 
    },
    resolve: async (root,args) => {
        try{
            const result = await prisma.basket.update({
                where:{
                    id : args.id
                },
                data:{
                    ProductsList:{
                        push: args.idProduct
                    }
                }
            })
            return {Statut : 200, Message :"Le Produit a bien eté rajouté",data: [result]}
        }
        catch(err){return {Statut : 0, Message : err}}
    }
})

const deleteProductBasket = mutationField("DeleteProductBasket",{
    type: nullable(ResBasket),
    args:{
        id : nonNull(intArg()),
        idProduct : nonNull(intArg()) 
    },
    resolve: async (root,args) => {
        try{

            // Recuperer la liste de produits
            const result = await prisma.basket.findUnique({
                where:{
                    id : args.id
                }
            })
            let list = []
            result.ProdutsList.forEach(element => {
                if(element != args.idProduct){
                    list.push(element)
                }
            });

            const result2 = await prisma.basket.update({
                where:{
                    id : args.id
                },
                data:{
                    ProductsList: list
                }
            })
            return {Statut : 200, Message :"Le Produit a bien eté rajouté",data: [result2]}
        }
        catch(err){return {Statut : 0, Message : err}}
    }
})

const deleteAllProductsBasket = mutationField("DeleteAllProductsBaket",{
    type: nullable(ResBasket),
    args:{
        id: nonNull(intArg())
    },
    resolve: async (root,args) => {
        try{
            const result = await prisma.basket.update({
                where:{
                    id: args.id
                },
                data: {
                    ProdutsList:{
                        unset : true,
                    }
                }
            })
            return {Statut: 200,Message : "La liste a bien étée supprimée",data: result
        }
        }
        catch(err){return {Statut : 0,Message : "Tous les produits du panier ont été supprimés"}}
    }
})

// Categories
// Fonction pour ajouter une catégorie
const postCategorie = mutationField("PostCategorie",{
    type: nullable(ResCategorie),
    args:{
        Score: nonNull(intArg())
    },
    resolve: async (root,args) => {
        try{
            const result = await prisma.categorie.create({
                data:{
                    Score: args.Score
                }
            })
            return {Statut : 200,Message: "L'insertion des données a réussi",data: [result]}
        }
        catch(err){return { Statut : 0,Message : err}}
    }
})

// Fonction pour dellete une catégorie
const deleteCategorie = mutationField('DeleteCategorie',{
    type: nullable(ResCategorie),
    args:{
        id : nonNull(intArg())
    },
    resolve: async(root,args) => {
        try{
            const result = await prisma.categorie.delete({
                where:{
                    id : args.id
                }
            })
            return {Statut : 200,Message : "La supression des données a reussi",data : [result]}
        }
        catch(err){return {Statut : 0, Message : err}}
    }
})
const deleteAllCategories = mutationField('DeleteAllCategories',{
    type: nullable(ResCategorie),
    resolve: async(root,args) => {
        try{
            const result = await prisma.categorie.deleteMany({});
            return {Statut : 200,Message : "La supression des données a reussi",data : result}
        }
        catch(err){return {Statut : 0, Message : err}}
    }
})

// Get
module.exports = {
    createUser,deleteUser,updateUser,deleteAllUsers,
    addProductBasket,deleteProductBasket,deleteAllProductsBasket,deleteBasket,
    postProduct,putProduct,deleteAllProducts,deleteProduct,putStatutProduct,updateNbBaskets,
    postCommand,addProductCommand,  
    postCategorie,deleteCategorie,deleteAllCategories
}