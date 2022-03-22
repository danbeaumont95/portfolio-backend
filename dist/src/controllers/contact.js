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
exports.sendEmailHandler = void 0;
const axios_1 = __importDefault(require("axios"));
function sendEmailHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const respBody = {
            success: false,
            message: '',
            data: {}
        };
        try {
            const { subject, text, userEmail } = req.body;
            const emailToSend = {
                sender: {
                    name: 'Portfolio Website user',
                    email: `${process.env.verifiedEmail}`,
                },
                to: [
                    {
                        email: `${process.env.emailAddressTo}`,
                        name: 'Dan portfolio site',
                    },
                ],
                subject,
                htmlContent: `<html><head></head><body><h3>Email from: ${userEmail}</h3><p>${text}</p></body></html>`,
            };
            const email = yield axios_1.default.post('https://api.sendinblue.com/v3/smtp/email', emailToSend, {
                headers: {
                    'api-key': process.env.sendinblueapikey,
                    'content-type': 'application/json',
                    accept: 'application/json',
                },
            });
            if (!email) {
                respBody.message = '[BadRequest] Error sending email';
                return res.status(200).json(respBody);
            }
            respBody.success = true;
            respBody.message = '[Success] Email sent!';
        }
        catch (error) {
            respBody.message = error;
            return res.status(400).json(respBody);
        }
        return res.status(200).json(respBody);
    });
}
exports.sendEmailHandler = sendEmailHandler;
