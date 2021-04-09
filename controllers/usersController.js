"use strict";

const User = require("../models/user");

module.exports = {
    login: (req, res) => {
        res.render("users/login");
    },
    index: (req, res, next) => {
        User.find()
            .then(users => {
                res.locals.users = users;
                next();
            })
            .catch(error => {
                console.log(`Error fetching subscrber data: ${error.message} `);
                next(error);
            })
    },
    indexView: (req, res) => {
        res.render("users/index");
    },
    new: (req, res) => {
        res.render("users/new");
    },
    create: (req, res, next) => {
        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            zipCode: req.body.zipCode,
            password: req.body.password
        });
        User.create(newUser)
            .then(user => {
                res.locals.user = user;
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`Error saving user: ${error.message}`);
                next(error);
            })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath != undefined) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`);
                next(error);
            })
    },
    showView: (req, res) => {
        res.render("users/show")
    },
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.render("users/edit", { user: user });
            })
            .catch(error => {
                console.log(`Error loading user by ID: ${error.message}`);
                next(error);
            })
    },
    update: (req, res, next) => {
        let userId = req.params.id;
        // let updatedUser = new User ({
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     email: req.body.email,
        //     zipCode: req.body.zipCode,
        //     password: req.body.password
        // });
        var updatedUser = {};
        updatedUser.firstName = req.body.firstName;
        updatedUser.lastName =  req.body.lastName;
        updatedUser.email = req.body.email;
        updatedUser.zipCode = req.body.zipCode;
        updatedUser.password = req.body.password;
        
        User.findByIdAndUpdate(userId, updatedUser)
        .then(user => {
            res.locals.user = user;
            res.locals.redirect = `/users/${user._id}`;
            next();
        })
        .catch(error => {
            console.log(`Error loading user by ID: ${error.message}`);
            next(error);
        })
    }, 
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
        .then(() => {
            res.locals.redirect = "/users";
            next();
        })
        .catch(error => {
            console.log(`Error loading user by ID: ${error.message}`);
            next(error);
        })
    }
}