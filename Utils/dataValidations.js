const fetchValidationTypes = (req, data) => {
    switch(data.type){
        case 'isEmail':
            try{
                req.checkBody(data.name).isEmail().withMessage(data.message || "provided email is incorrect");
            }
            catch(err){
                console.log(err)
            }
            break;
        case 'isLength':
            try{
                req.checkBody(data.name).isLength({min:data.min || 0, max: data.max || 32768}).withMessage(data.message || `${data.name} should have min length 0 and max length 32768`)
            }
            catch(err){
                console.log(err)
            }
            break;
    }

    if(data.type === 'isEmail'){

    }
}

exports.validateBody = (req, body) => {
    body.forEach((data)=>{
        fetchValidationTypes(req, data)
    })

    return req.validationErrors();
}