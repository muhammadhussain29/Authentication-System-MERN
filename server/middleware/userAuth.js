import jwt from 'jsonwebtoken'

const userAuth = async (req,res,next) =>{

    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, msg: 'Authentication required. Please log in.'})
    }
    try {
        
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET) 
        
        req.body = req.body || {};

        if(tokenDecode.id){
            req.body.user_id = tokenDecode.id
        }else{
            return res.json({success: false, msg: "Invalid token. Please log in again"})
        }
        next();

    } catch (error) {
        return res.json({success: false, msg: error.message})
    }

}

export default userAuth;