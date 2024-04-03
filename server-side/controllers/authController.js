const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.register = async(req,res) =>{

   try {

    const { name, email , password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "User registered successfully" ,token :token});

   } catch (error) {
    console.error("Registration Error:", error);

     res.status(500).json({ error : "Registration Failed"});
   }
}


exports.login = async(req,res) =>{

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token : token , user : user});
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Login Failed" });
    }
 }

 exports.logout = async(req,res) =>{

    try {
        const token = req.headers.authorization.replace('Bearer ', '');    
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Login Failed" });
    }
 }