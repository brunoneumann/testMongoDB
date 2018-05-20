/*jshint esversion: 6 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Documentos = new Mongo.Collection("documentos");

Template.hello.onCreated(function helloOnCreated() {
    Meteor.subscribe("documentos");

    Meteor.call("deleteAll");

    // Atualiza 500 documentos
    var update = Meteor.bindEnvironment(function(){
        for (let i = 1; i <= 500; i++) {
            let data = {
                _id: i + "",
                name: Math.random().toString(36).substring(2)
            };
            Meteor.call("update", data);
            if(i===500){
                setTimeout(function(){
                    remove();
                },1000);
            }
        }
    });

    // Remove 500 documentos
    var remove = Meteor.bindEnvironment(function(){
        for (let i = 1; i <= 500; i++) {
            Meteor.call("delete", i + "");
            if(i===500) {
                insert();
            }
        }
    });

    // Insere 500 documentos
    var insert = Meteor.bindEnvironment(function(){
        for (let i = 1; i <= 500; i++) {
            let data = {
                _id: i + "",
                name: Math.random().toString(36).substring(2)
            };
            Meteor.call("insert", data);

            if(i===500){
                setTimeout(function(){
                    update();
                },1000);
            }
        }
    });

    // Start
    insert();

});

Template.hello.helpers({
    'documentos': function() {
        return Documentos.find({}, { sort: { createdAt: -1 } });
    },
    'total': function() {
        return Documentos.find().count();
    }
});
