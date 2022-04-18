"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (uid, name) => {
    const payload = { uid, name };
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, `${process.env.SECRET_JWT_SEED}`, { expiresIn: '24h' }, (err, token) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.default = generateJWT;
