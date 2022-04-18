import {Request, Response} from 'express'
import bcrypt from 'bcryptjs';
import userModel from '../models/user';
import generateJWT from '../helpers/jwt';

class AuthController
{

  public async getUser(req:Request,res:Response)
  {
      res.json(
      {
          ok:true,
          msg:'Get user'
      })
  }

  public async loginUser(req:Request,res:Response):Promise<any>
  {
    const {email,password} = req.body;

    try
    {
        const dbUser = await userModel.findOne({email});
        if(!dbUser)
        {
          return res.status(400).json(
            {
              ok:false,
              msg: 'El usuario no existe'
            })
        }

        const validPassword = bcrypt.compareSync(password,dbUser.password);
        if(!validPassword)
        {
          return res.status(400).json(
            {
              ok:false,
              msg: 'Contraseña incorrecta'
            })
        }

        const token = await generateJWT(dbUser.id, dbUser.name);

        return res.json(
          {
            ok:true,
            uid: dbUser.id,
            name: dbUser.name,
            token
          })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json(
          {
            ok:false,
            msg: 'contacte al adminstrado del sistema'
          })
    }
  }

  public async createUser(req:Request,res:Response):Promise<any>
  {
    const {email,name,password} = req.body;

    try
    {
        const user = await userModel.findOne({email});
        if(user)
        {
          return res.status(400).json(
            {
              ok:false,
              msg: 'Ya existe un usario registrado con este email'
            });
        }

        const dbUser = new userModel(req.body);

        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);
        const token = await generateJWT(dbUser.id, name);
        await dbUser.save();

        return res.status(201).json(
          {
            ok:true,
            uid: dbUser.id,
            name,
            token
          });
    }
    catch(error)
    {
      console.log(error);
      return res.json(
        {
          ok: false,
          msg: 'Por favor hable con el admin'
        })
    }
  }

  public async renovateToken(req:Request,res:Response):Promise<any>
  {
    const {uid,name} = req.body;
    const token = await generateJWT(uid,name);

    return res.json(
      {
        ok: true,
        uid,
        name,
        token
      })
  }
}

const authController: AuthController = new AuthController();

export default authController;
