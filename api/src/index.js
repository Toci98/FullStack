const { ApolloServer, gql } = require("apollo-server");
const { MongoClient } = require("mongodb");

const typeDefs = gql`

    type Person {
        _id: ID!
        name: String
        surname: String
        phone_number: String
        email: String
    }

    type Query {
        test: String
        getPersons(sort: Boolean): [Person!]!
        deleteAll: [Person!]!
    }

    type Mutation{
        addPerson(name: String, surname: String, phone_number: String, email: String): Person!
        delete(phone_number: String): Person!
        update(phone_number_init: String, name: String, surname: String, phone_number: String, email: String): Person!
        getSortedPersons(sort: Boolean): [Person!]!
    }
`
const resolvers = {
    Query: {
        test: () => "Working Okk",
        getPersons: (parent, args, ctx) => {
            const db = ctx.db;
            const { sort } = args;
            var aux = 1;
            if (sort == false) {
                aux = -1;
            }
            return db.collection("persons").find({}).sort({ "name": aux }).toArray();
        },
        deleteAll: (parent, args, ctx) => {
            const db = ctx.db;
            return db.collection("persons").deleteMany({});
        }
    },
    Mutation: {
        addPerson: async (parent, args, ctx) => {
            const db = ctx.db;
            const { name, surname, phone_number, email } = args;
            const { insertedId } = await db.collection("persons").insertOne({ name, surname, phone_number, email });
            return { _id: insertedId, name, surname, phone_number, email };
        },
        delete: async (parent, args, ctx) => {
            const db = ctx.db;
            const { phone_number } = args;
            const deletedName = await db.collection("persons").deleteOne({ "phone_number": phone_number });
            return { phone_number: phone_number };
        },
        update: async (parent, args, ctx) => {
            const db = ctx.db;
            const { phone_number_init, name, surname, phone_number, email } = args;
            const { updatedId } = await db.collection("persons").update({ "phone_number": phone_number_init }, { $set: { "name": name, "surname": surname, "phone_number": phone_number, "email": email } });
            return { updatedId };
        },
        getSortedPersons: async (parent, args, ctx) => {
            const db = ctx.db;
            const { sort } = args;
            var aux = 1;
            if (sort == false) {
                aux = -1;
            }
            return db.collection("persons").find({}).sort({ "name": aux }).toArray();
        }
    }
}

const mongourl = process.env.MONGO_URL;
if (!mongourl) console.log("Envío fallido");
else {
    const client = new MongoClient(mongourl);
    try {
        client.connect().then(() => {
            console.log("Mongo conectado siuu");
            const server = new ApolloServer({
                typeDefs,
                resolvers,
                context: () => { return { db: client.db("test") } }
            });
            server.listen().then(({ url }) => {
                console.log(`Servidor escuchando en ${url}`);
            })
        });
    } catch (e) {
        console(console.error(e));
    }
}