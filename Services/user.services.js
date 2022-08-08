const userModel = require('./../Models/user')

class userService{
    
    add(data) {
        return userModel.add(data);
    }

    find(data,sort,limit,skip){
        return userModel.find(data, sort, limit, skip);
    }
}