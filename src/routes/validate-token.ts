import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';

const validateToken = (req: Request, res:Response, next:NextFunction)  =>{
    

    const headerToken = req.headers['authorization']
    
    if (headerToken!=undefined && headerToken.startsWith('Bearer ')) {
        //existe un token pero aun no sabemos si es valido o no
        //necesitamos borrar los primeros 7 caracteres que son (bearer ) para solamete quedarnos con el token 
        try {
            const bearerToken = headerToken.slice(7);
            jwt.verify(bearerToken, process.env.SECRET_KEY || 'pepito123')
            next()
        } catch (error) {
            res.status(401).json({
                msg: 'token no valido'
            })
        }
    }else{
        res.status(401).json({
            msg: 'Acceso denegado'
        })
    }
   
}

export default validateToken;   