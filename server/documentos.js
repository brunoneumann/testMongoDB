/*jshint esversion: 6 */
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const Documentos = new Mongo.Collection("documentos");


if (Meteor.isServer) {

    Meteor.publish("documentos", function() {
        return Documentos.find();
    });


    Meteor.methods({

        "upsert": function(data) {
            Documentos.upsert({
                _id: data._id
            }, {
                $set: {
                    name: data.name,
                    createdAt: new Date()
                }
            });
        },

        "insert": function(data) {
            Documentos.insert({
                _id: data._id,
                name: data.name,
                createdAt: new Date()
            });
        },
        "update": function(data) {
            Documentos.update({
                _id: data._id
            }, {
                $set: {
                    name: data.name
                }
            });
        },
        "delete": function(_id) {
            Documentos.remove({ _id: _id });
        },
        "deleteAll": function() {
            Documentos.remove({});
        },

        "getOplogSize": function() {
            var database = new MongoInternals.RemoteCollectionDriver('mongodb://localhost:3001/local');
            return database.open('oplog.rs').find({}).count();
        }


    });
}
