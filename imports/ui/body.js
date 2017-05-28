import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './body.html';

import './task.js';


Template.body.onCreated(function bodyOnCreated() {

    this.state = new ReactiveDict();

});



Template.body.helpers({

    tasks() {


        const instance = Template.instance();

        if (instance.state.get('hideCompleted')) {

            //if hideCompleted is checked, filter tasks

            return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
            //$ne stands for not equal, this above filters the not checked elements from
            //the document
        }

          //otherwise return all of the tasks
        return Tasks.find({}, { sort: { createdAt: -1 } });
    },

    incompleteCount() {
    
     return Tasks.find({checked: {$ne: true}}).count();

    },

});


Template.body.events({

    'submit .new-task'(event) {

        // Prevent  browser from default submit
        event.preventDefault();

        //get value from form element
        const target = event.target;
        const text = target.text.value;

        //inserts a task into the Mongo collection 
        Tasks.insert({

            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,

        });


        //clear form

        target.text.value = '';

    },


    'change .hide-completed input'(event, instance) {

        instance.state.set('hideCompleted', event.target.checked);
    },


});




