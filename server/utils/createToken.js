import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn : "30d",
    });

    //this will set the value of the coookie to our jwt
    res.cookie('jwt', token, {
        httpOnly : true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 30*24*60*60*1000,
        path : '/'
    })

    return token
}

export default generateToken;