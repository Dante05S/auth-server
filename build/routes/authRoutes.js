"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = __importDefault(require("../controllers/authController"));
const validateFields_1 = __importDefault(require("../middleware/validateFields"));
const validateJwt_1 = __importDefault(require("../middleware/validateJwt"));
class AuthRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.validateLogin = [(0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
            (0, express_validator_1.check)('password', 'El password es obligatorio').isLength({ min: 6 })];
        this.validateNewUser = [(0, express_validator_1.check)('name', "El nombre de usuario es obligatorio").notEmpty(),
            (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
            (0, express_validator_1.check)('password', 'El password es obligatorio').isLength({ min: 6 })];
        this.config();
    }
    config() {
        this.router.get('/', authController_1.default.getUser);
        this.router.post('/', this.validateLogin, validateFields_1.default.validate, authController_1.default.loginUser);
        this.router.post('/new', this.validateNewUser, validateFields_1.default.validate, authController_1.default.createUser);
        this.router.get('/renew', validateJwt_1.default.validate, authController_1.default.renovateToken);
    }
}
const authRoutes = new AuthRoutes();
exports.default = authRoutes.router;
