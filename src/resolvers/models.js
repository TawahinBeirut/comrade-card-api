const {objectType} = require("nexus");
const { NexusInterfaceTypeDef, intArg, nonNull } = require("nexus/dist/core");

// User 
const User = objectType({
    name: 'User',  
    definition(t) {
        t.id("id")
        t.string("Name")
        t.string("Email")
        t.string("Password")
        t.int("Score")
    }
})

// Product
const Product = objectType({
    name : 'Product',
    definition(t){
        t.id("id")
        t.string("Name")
        t.int("Statut")
        t.string("Description")
        t.int("SellerId")
        t.int("NbBaskets")
        t.int("idCategorie")
        t.list.field('Categorie',{type : nonNull('Int')})    
    }
})

// Basket
const Basket = objectType({
    name : 'Basket',
    definition(t){
        t.id("id")
        t.list.field('products',{type: Product})
    }
})

// Command

const Command = objectType({
    name : 'Command',
    definition(t){
        t.id("id")
        t.id("UserId")
        t.list.field("products",{type: Product})
    }
})

// Categorie
const Categorie = objectType({
    name : 'Categorie',
    definition(t){
        t.id("id")
        t.int("Score")
        t.list.field("products",{type: Product})
        t.int("Stock")
    }
})

const ResUser = objectType({
    name : 'ResUser',
    definition(t){
        t.int("Statut")
        t.string("Message")
        t.string("Cookie")
        t.list.field("data",{type:User})
    }
})
const ResBasket = objectType({
    name : 'ResBasket',
    definition(t){
        t.int("Statut")
        t.string("Message")
        t.string("Cookie")
        t.list.field("data",{type:Basket})
    }
})
const ResProduct = objectType({
    name : 'ResProduct',
    definition(t){
        t.int("Statut")
        t.string("Message")
        t.string("Cookie")
        t.list.field("data",{type:Product})
    }
})
const ResCommand = objectType({
    name : 'ResCommand',
    definition(t){
        t.int("Statut")
        t.string("Message")
        t.string("Cookie")
        t.list.field("data",{type:Command})
    }
})
const ResCategorie = objectType({
    name : 'ResCategorie',
    definition(t){
        t.int("Statut")
        t.string("Message")
        t.string("Cookie")
        t.list.field("data",{type:Categorie})
    }
})

module.exports = {
    User,Product,Basket,Command,Categorie,
    ResUser,ResBasket,ResProduct,ResCommand,ResCategorie
}