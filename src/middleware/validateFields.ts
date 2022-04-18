import {Request, Response} from 'express'
import {validationResult} from 'express-validator'


class ValidateFields
{
  public validate(req:Request, res:Response, next:Function)
  {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json(
        {
          ok:false,
          errors: errors.mapped()
        })
    }

    next();
  }
}

const validateFields: ValidateFields = new ValidateFields();

export default validateFields;
