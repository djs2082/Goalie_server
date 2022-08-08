const { response } = require("express");
const bcrypt = require('bcryptjs');
const userService = require('./../Services/user.services')

class UserController{
    async userRegister(req,res){
        const responseResult = {}
        req.body.userName = req.body.userName.trim();
        req.body.email = req.body.email.trim();
        req.checkBody("userName").isLength({min: 8}).withMessage("Username must contain minimun 8 characters");
        req.checkBody("email", "provided email is not correct").isEmail();
        req.checkBody("password").isLength({ min: 8 }).withMessage("Password must contain minimum 8 characters");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        var user = new UserController();

        const errors = req.validationErrors();
        let statusCode = 201;
        if(errors){
            responseResult.success = false;
            responseResult.message = errors[0].msg;
            responseResult.errors = errors;
            console.log("validatoin errors while sign up: ",errors);
            statusCode = 400;
            res.status(statusCode).send(responseResult);
        }
        else{
            let userData = {
                userName: req.body.userName,
                email: req.body.email,
                password: hashedPassword
            }
            
            let existEmail = await userService.find({email: userData.email, isVerified: true});
            if(existEmail != undefined && existEmail.length > 0){
                //console.log(emailMb);
                responseResult.success = false,
                statusCode = 409;
                responseResult.message = "Email already exists"
                console.log("Email already exist:"+userData.email);
                res.status(statusCode).send(responseResult);
            }
            else{
                await userService.add(userData)
                .then((result) => {
                    if(result.code === 11000){
                        responseResult.success = false;
                        statusCode = 409;
                        responseResult.message = "Email Already exists";
                    }
                    else{
                        responseResult.success = true;
                        statusCode = 201;
                        responseResult.message = "Successfully Saved Users Data"
                    }

                    let token = jwt.sign({
                        _id: result._id,
                        username:result.userName,
                        email:result.email,
                        userType: result.userType
                    },process.env.JWT_SECRET_KEY);
                    responseResult.result = result
                    responseResult.token = token
                    res.header('Authorization',"Bearer "+token).status(statusCode).send(responseResult)
                }).catch((error) => {
                    console.log("Error adding user:"+error);
                    responseResult.success = false;
                    responseResult.error = error;
                    statusCode = 500;
                    res.status(statusCode).send(responseResult)
                })
            }
        }
    }
}
