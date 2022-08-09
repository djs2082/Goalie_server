const userModel = require('./../Models/user')

class userService{
    
    add(data) {
        console.log(data)
        return userModel.add(data);
    }

    find(data,sort,limit,skip){
        return userModel.find(data, sort, limit, skip);
    }
}

module.exports = new userService();