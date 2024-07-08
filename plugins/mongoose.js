const fp = require('fastify-plugin');
const mongoose = require('mongoose');

async function dbConnector(fastify,options){
    try{
        await mongoose.connect(options.uri);
        fastify.decorate('mongoose',mongoose);
        console.log('MongoDB connected Successfully.');
        fastify.decorate('mongo' , {
            db : mongoose.connection.db,
            client : mongoose.connection.client,
        });
    }
    catch(err)
    {
        console.error('MongoDB connection error : ', err);
    }
};

module.exports = fp(dbConnector);