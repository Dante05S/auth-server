"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
class AuthController {
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({
                ok: true,
                msg: 'Get user'
            });
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const dbUser = yield user_1.default.findOne({ email });
                if (!dbUser) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El usuario no existe'
                    });
                }
                const validPassword = bcryptjs_1.default.compareSync(password, dbUser.password);
                if (!validPassword) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Contraseña incorrecta'
                    });
                }
                const token = yield (0, jwt_1.default)(dbUser.id, dbUser.name);
                return res.json({
                    ok: true,
                    uid: dbUser.id,
                    name: dbUser.name,
                    token
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    ok: false,
                    msg: 'contacte al adminstrado del sistema'
                });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, password } = req.body;
            try {
                const user = yield user_1.default.findOne({ email });
                if (user) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un usario registrado con este email'
                    });
                }
                const dbUser = new user_1.default(req.body);
                const salt = bcryptjs_1.default.genSaltSync();
                dbUser.password = bcryptjs_1.default.hashSync(password, salt);
                const token = yield (0, jwt_1.default)(dbUser.id, name);
                yield dbUser.save();
                return res.status(201).json({
                    ok: true,
                    uid: dbUser.id,
                    name,
                    token
                });
            }
            catch (error) {
                console.log(error);
                return res.json({
                    ok: false,
                    msg: 'Por favor hable con el admin'
                });
            }
        });
    }
    renovateToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, name } = req.body;
            const token = yield (0, jwt_1.default)(uid, name);
            return res.json({
                ok: true,
                uid,
                name,
                token
            });
        });
    }
}
const authController = new AuthController();
exports.default = authController;
