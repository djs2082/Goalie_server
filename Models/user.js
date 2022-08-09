const mongoose = require('mongoose');
const { resolve } = require('path');
const { reject } = require('async');

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

const user = mongoose.model('users',userSchema);

class User {
    add(data,callBack){
        let userData = new user(data);
        return new Promise((resolve,reject) => {
            userData.save().then((result) => {
                resolve(result)
            }).
            catch((err)=>{
                reject(err)
            })
        })
    }

    find(data,sort,limit,skip){
        if (limit != undefined) {
            return new Promise((resolve, reject) => {
                user.find(data).sort(sort)
                .limit(parseInt(limit,10))
                .skip(parseInt(skip,10))
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.log("Error in fetching users list:"+error);
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                user.find(data).sort(sort)
                .then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                })
            })
        }
    }

}

module.exports = new User();