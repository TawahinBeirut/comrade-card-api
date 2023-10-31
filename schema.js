const {makeSchema, objectType, queryField, arg, mutationField, nullable, nonNull, intArg, stringArg, list} = require("nexus")
const Models = require("./resolvers/models");
const Mutations = require("./resolvers/mutations");
const Queries = require("./resolvers/queries");

const schema = makeSchema({
    types : [Models,Mutations,Queries]
})

module.exports = schema;