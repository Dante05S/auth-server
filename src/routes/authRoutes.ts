import {Router} from 'express';
import {check, ValidationChain} from 'express-validator';
import authController from '../controllers/authController';
import validateFields from '../middleware/validateFields';
import validateJwt from '../middleware/validateJwt';

class AuthRoutes
{
  public router: Router = Router();
  private validateLogin:ValidationChain[] =
  [check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').isLength({min: 6})];

  private validateNewUser:ValidationChain[] =
  [check('name',"El nombre de usuario es obligatorio").notEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').isLength({min: 6})];

  constructor()
  {
    this.config();
  }

  config(): void
  {
    this.router.get('/',authController.getUser);
    this.router.post('/',this.validateLogin, validateFields.validate, authController.loginUser);
    this.router.post('/new',this.validateNewUser,validateFields.validate,authController.createUser);
    this.router.get('/renew',validateJwt.validate, authController.renovateToken);
  }

}

const authRoutes:AuthRoutes = new AuthRoutes();

export default authRoutes.router;
