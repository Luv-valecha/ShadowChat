import jwt from "jsonwebtoken"

// Generates a json web token
export const generateToken = (userId, res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET, { expiresIn : "7d"})

    res.cookie("jwt",token,{
        expiresIn : 7 * 24 * 60 * 60, // 7 days in milliseconds
        httpOnly : true, // Prevents client-side JavaScript from accessing the cookie
        sameSite : true, // Prevents cross-site request forgery (CSRF) attacks
        secure : process.env.NODE_ENV !== "development", // Sends the cookie only over HTTPS in production
    })
    return token;
}