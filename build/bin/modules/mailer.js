"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule)
        return mod;
    var result = {};
    if (mod != null)
        for (var k in mod)
            if (Object.hasOwnProperty.call(mod, k))
                result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodeMailer = __importStar(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const log_1 = __importDefault(require("./log"));
class MailClass {
    constructor(from, subject, content, list, smtp_credentials) {
        this.list = list;
        this.smtp_credentials = smtp_credentials;
        this.failed = [];
        this.success = [];
        this.pending = [];
        this.ui = new inquirer_1.default.ui.BottomBar();
        this.transport = null;
        if (!this.list || list.length == 0) {
            log_1.default.warn("empty mailing list");
            return;
        }
        if (!smtp_credentials.username) {
            log_1.default.error("username is required");
            return;
        }
        if (!smtp_credentials.password) {
            log_1.default.error("password is required");
            return;
        }
        this.transport = NodeMailer.createTransport({
            host: 'mail.privateemail.com',
            port: 465,
            secure: true,
            auth: {
                user: smtp_credentials.username,
                pass: smtp_credentials.password
            }
        });
        this.pending = this.list.map((email) => {
            const data = {};
            data.to = [email.toLowerCase().trim()];
            data.subject = subject;
            data.from = `${from} <${smtp_credentials.username}>`;
            data.content = content;
            data.ref = Date.now().toLocaleString();
            data.status = "pending";
            data.created_on = new Date().toString();
            data.timestamp = Date.now();
            return data;
        });
        this.send(this.pending.pop());
    }
    async send(data) {
        try {
            await this.transport.sendMail({ from: data.from, subject: data.subject, to: data.to, html: data.content, });
            data.status = "success";
            this.success.push(data);
            return { code: 200, message: 'sent' };
        }
        catch (err) {
            console.log(err);
            data.status = "failed";
            this.failed.push(data);
            data.metadata = { error: err.message };
            return { code: 500, message: 'failed' };
        }
        finally {
            log_1.default.reset();
            const msg = `${data.to[0]} => ${data.status}`;
            if (data.status === "success")
                log_1.default.success(msg);
            else if (data.status === "failed")
                log_1.default.error(msg);
            else
                log_1.default.warn(msg);
            log_1.default.reset();
            if (this.pending.length > 0) {
                return this.send(this.pending.pop());
            }
            else {
                this.ui.updateBottomBar(`Sent: ${this.success.length}, Failed: ${this.failed.length}, Pending: ${this.pending.length}`);
                return;
            }
        }
    }
    async insertOne(fileName, data) {
        return new Promise((res, rej) => {
            if (fs_1.default.existsSync(`${process.cwd()}/${fileName}`) == false)
                return rej({ message: "File Not Found" });
        });
    }
}
exports.default = MailClass;
