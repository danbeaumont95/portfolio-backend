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
const express_1 = __importDefault(require("express"));
require('dotenv').config({ path: __dirname + '/.env' });
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const router = express_1.default.Router();
const allowedOrigins = ['http://localhost:3001'];
const dbUri = process.env.dbUri;
const port = process.env.PORT || 1337;
const options = {
    origin: allowedOrigins
};
mongoose_1.default.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)(options));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use('/api', router);
    app.get('/info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send({ name: 'Portfolio API', version: '0.0.1 BETA' });
    }));
    app.listen(port, () => {
        console.log(`Server listening at ${port}`);
    });
    (0, routes_1.default)(app);
});
