

const UserModel = require("../models/User.model")


const authorisation = (permittedRoles) => {

    return async (req, res, next) => {
        let {email} = req.body
        const user = await UserModel.findOne({email})
        //permittedRoles - array of string/strings

        //.includes
        let auth = false;
        if(permittedRoles.includes(user.role)){
            auth = true;
        }
        if(!auth){
            return res.send("not authorised")
        }
        next()
    }
}
 

module.exports = authorisation;

//12 : 18