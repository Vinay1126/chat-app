import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import generateToken from "../utils/generateToken.js";

export const signUp = async (req, res) => {
    try {
        const {fullname, username, password, confirmPassword, gender} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error : "Passwords do not match"});
        }

        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({error : "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullname, username, password : hashedPassword, gender,
            profilePic : gender === "male" ? boyProfilePic : girlProfilePic
        })

        if(newUser){

            generateToken(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                message : "User created successfully",
                _id : newUser._id,
                fullname : newUser.fullname,
                username : newUser.username,
                profilePic : newUser.profilePic,
                updatedAt : newUser.updatedAt,
                createdAt : newUser.createdAt,
            });
        } else {
            return res.status(500).json({error : "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        return res.status(500).json({error : "Internal server error"});
    }
}

export const logIn = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPassCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPassCorrect){
            res.status(400).json({error : "Invalid credentials"});
        }

        generateToken(user._id, res);

        res.status(201).json({
            message : "Login successfully",
            _id : user._id,
            fullname : user.fullname,
            username : user.username,
            profilePic : user.profilePic,
        });


    } catch (error) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({error : "Internal server error"});
    }
}


export const logOut = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge : 0});
        res.status(200).json({message : "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({error : "Internal server error"});
    }
}