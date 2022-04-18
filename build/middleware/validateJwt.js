"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ValidateJwt {
    validate(req, res, next) {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({
                ok: false,
                msg: 'error de token'
            });
        }
        try {
            const verifyToken = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_JWT_SEED}`);
            console.log(verifyToken.uid, verifyToken.name);
            req.body.uid = verifyToken.uid;
            req.body.name = verifyToken.name;
        }
        catch (error) {
            return res.status(401).json({
                ok: false,
                msg: 'token no valido'
            });
        }
        next();
    }
}
const validateJwt = new ValidateJwt();
exports.default = validateJwt;
