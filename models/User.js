'use strict';
// jshint esversion: 6
// jshint devel: true
// jshint node: true
// jshint browser: true
// jshint mocha: true

const knex = require('../db/knex');
const bcrypt = require('bcrypt-as-promised');

class User {
    constructor(request) {
      console.log(request)
        this.id = request.id;
        this.linkedinId = request.linkedinId
        this.firstName = request.firstName;
        this.lastName = request.lastName;
        this.headline = request.headline;
        this.location = "San Francisco Bay Area";
        this.industry = request.industry;
        this.summary = request.summary;
        this.specialties = request.specialties;
        this.profilePictureUrl = request.pictureUrl;
        this.email = request.emailAddress;
        this.password = request.password;
    }

    toObject() {
        return {
            id: this.id,
            linkedin_id: this.linkedinId,
            first_name: this.firstName,
            last_name: this.lastName,
            headline: this.headline,
            location: this.location,
            industry: this.industry,
            positions: this.positions,
            pic_url: this.profilePictureUrl,
            email: this.email,
            password: this.password
        };
    }

    postToDB(res) {
        var password = this.password;
        var that = this;

        bcrypt.hash(password, 12)
            .then(function(hashedPassword) {
                return hashedPassword;
            }).then(function(hashedPassword) {
                var postObject = that.toObject();
                delete postObject.password;
                postObject.hashed_password = hashedPassword;
                console.log(postObject);

                knex('users')
                    .insert(postObject)
                    .returning('*')
                    .then(function(user) {
                        console.log(user);
                        res.send(user[0]);
                    })
                    .catch(function(err ) {
                        console.log('post error: ' + err);
                    })
            })
    }
}

module.exports = User;
