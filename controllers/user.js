const bcrypt = require('bcryptjs');
const User = require('../models/user');

class userController {
    async signup(request,reply){
        const { name, email, password } = request.body;

        try {
            let user = await User.findOne({email});
            if(user){
                return reply.status(400).send({msg : 'Email already exists.'})
            }
            user = new User({name,email,password});

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);
            await user.save();
            reply.status(201).send({msg : 'User Created successfully',user});
        }
        catch(err){
            console.error(err.message);
        }
    };

    async login(request,reply){
        const { email, password} = request.body;

        try{
            let user = await User.findOne({email});
            if(!user){
                return reply.status(400).send({ msg : 'No user exists with this email.'});
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return reply.status(400).send({msg : 'Wrong Password'});
            }
            return reply.status(201).send({msg : 'Login Successful'});
        }
        catch(err){
            console.error(err.message);
        }
    };

}

module.exports = new userController();