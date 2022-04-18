import {Request, Response} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';

class ValidateJwt
{
  public validate(req:Request, res:Response, next:Function)
  {
    const token = req.header('Authorization');
    if(!token)
    {
      return res.status(401).json(
        {
          ok:false,
          msg: 'error de token'
        })
    }

    try
    {
        const verifyToken:any = jwt.verify(token, `${process.env.SECRET_JWT_SEED}`);
        console.log(verifyToken.uid, verifyToken.name);
        req.body.uid = verifyToken.uid;
        req.body.name = verifyToken.name;
    }
    catch(error)
    {
      return res.status(401).json(
        {
          ok:false,
          msg:'token no valido'
        })
    }

    next();
  }
}

const validateJwt: ValidateJwt = new ValidateJwt();

export default validateJwt;
