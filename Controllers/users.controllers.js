const { response } = require("express");
const userService = require('./../Services/user.services')
const { validateBody }= require('../Utils/dataValidations')
const { ecryptHash, comparePassword }= require('./../Utils/encryptUtils')
const { generateToken }= require('./../Services/token.services')
const { apiResponse }= require('../Utils/genResponse')

class UserController{
    async userRegister(req,res){
        const responseResult = {}
        req.body.username = req.body.username.trim();
        req.body.email = req.body.email.trim();

        validateBody(req,[
            {
                name: "username",
                type: "isLength",
                min: 8,
                message: "Username Must Have atleaset 8 characters"
            },
            {
                name: "email",
                type: "isEmail",
                message: "Invalid Email"
            },
            {
                name: "password",
                type: "isLength",
                min: 8,
                message: "Password must have atleast 8 characters"
            }
        ])

        const hashedPassword = await ecryptHash(10,req.body.password)
        var user = new UserController();

        const errors = req.validationErrors();
        if(errors.length > 0){
            res.status(400).send(apiResponse({success:false, message:errors[0].msg, errors}));
        }
        else{
            let userData = {
                userName: req.body.username,
                email: req.body.email,
                password: hashedPassword
            }
            
            let existEmail = await userService.find({email: userData.email, isVerified: true});
            let existUsername = await userService.find({userName: userData.userName, isVerified: true});
            if(existUsername != undefined && existUsername.length > 0){
                res.status(409).send(apiResponse({success: false,message: "Username already exists"}));
            }

            else if(existEmail != undefined && existEmail.length > 0){
                res.status(409).send(apiResponse(false, "Email already exists"));
            }
            else{
                await userService.add(userData)
                .then((result) => {
                    if(result.code === 11000){
                        res.status(409).send(apiResponse({success:false, message:"Email already exists"}));
                    }
                    else{
                        let token = generateToken(result.id, result.userName, result.email)
                        res.header('Authorization',"Bearer "+token).status(201).send(apiResponse({success:true,message:"User Created Successfully",result, token}))
                    }


                }).catch((error) => {
                    res.status(500).send(apiResponse({success: false, error}))
                })
            }
        }
    }

    userLogin(req, res){
        const responseResult = {}
        req.body.email = req.body.email.trim();
        validateBody(req,[
            {
                name: "email",
                type: "isEmail",
                message: "Email is Invalid"
            },
            {
                name: "email",
                type: "isLength",
                min: 0,
                message: "Please provide Email"
            },
            {
                name: "password",
                type: "isLength",
                min: 8,
                message: "Password must have atleast 8 characters"
            },
            {
                name: "password",
                type: "isLength",
                min: 0,
                message: "Please Provide Password"
            }
        ])

        const errors = req.validationErrors();
        if(errors.length > 0){
            res.status(400).send(apiResponse({success:false, message:errors[0].msg, errors}));
        }
        else{
            let userData = {
                email: req.body.email.toLowerCase(),
            }
            userService.find(userData)
            .then(async (userData) => {
                if(typeof userData != undefined && userData.length > 0){
                    let isVerified = false;
                    let verifiedUser = null;
                    for(let user of userData){
                        if(user.isVerified){
                            isVerified = true;
                            verifiedUser = user;
                            break;
                        }
                    }


                    if(isVerified){
                        const validPass = await comparePassword(req.body.password, verifiedUser.password)
                        if(validPass){
                            let token = generateToken(verifiedUser.id, verifiedUser.userName, verifiedUser.email);
                            return res.header('Authorization',"Bearer "+token).status(200).send(apiResponse({token,message:"User Logged In Successfully"}))
                        }
                        else{
                            res.status(400).send(apiResponse({error:"Invalid Email or Password"}))
                        }
                    }
                    else{
                        res.status(400).send(apiResponse({success: false, error: "You have not verified your email address. please check verification email in your inbox and click on verification link"}))
                    }
                }
                else{
                    res.status(404).send(apiResponse({error: "Email Id not found"}))
                }
            })
            .catch((error) => {
                res.status(404).send(apiResponse({error}))
            })
        }
    }
}
module.exports = new UserController();