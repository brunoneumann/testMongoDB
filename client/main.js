/*jshint esversion: 6 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Documentos = new Mongo.Collection("documentos");

Template.hello.onCreated(function helloOnCreated() {
    this.oplog = new ReactiveVar();
    var self = this.oplog;

    Meteor.subscribe("documentos");

    setInterval(function(){
        Meteor.call("getOplogSize", function(err,res){
            if(res){
                self.set(res);
            }
        });
    },2000);
});

Template.hello.helpers({
    'documentos': function() {
        return Documentos.find({}, { sort: { createdAt: -1 } });
    },
    'total': function() {
        return Documentos.find().count();
    },
    'oplogSize': function() {
        return Template.instance().oplog.get();
    }
});

Template.hello.events({
    'click [id=start]': function(e) {
        e.preventDefault();

        // Delete all first
        Meteor.call("deleteAll");

        let size = 500;

        var update = Meteor.bindEnvironment(function(){
            for (let i = 1; i <= size; i++) {
                let data = {
                    _id: i + "",
                    name: Math.random().toString(36).substring(2)
                };
                Meteor.call("update", data);
                if(i===size){
                    setTimeout(function(){
                        remove();
                    },1000);
                }
            }
        });

        var remove = Meteor.bindEnvironment(function(){
            for (let i = 1; i <= size; i++) {
                Meteor.call("delete", i + "");
                if(i===size) {
                    insert();
                }
            }
        });

        var insert = Meteor.bindEnvironment(function(){
            for (let i = 1; i <= size; i++) {
                let data = {
                    _id: i + "",
                    name: Math.random().toString(36).substring(2)
                };
                Meteor.call("upsert", data);

                if(i===size){
                    setTimeout(function(){
                        update();
                    },1000);
                }
            }
        });

        insert();
    }
});
