"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = __importDefault(require("./modules/mailer"));
const inquirer_1 = __importDefault(require("inquirer"));
const log_1 = __importDefault(require("./modules/log"));
const fs_1 = __importDefault(require("fs"));
const _package = require("../package.json");
const emailListUri = `${process.cwd()}/payload.txt`;
(async () => {
    log_1.default.info(`Custom Mailer ${_package.version}`);
    const smtp_credentials = await inquirer_1.default.prompt([
        { message: "Enter SMTP username", name: "username", type: "input", validate: (e) => { if (!e)
                return "username is invalid"; return true; } },
        { message: "Enter SMTP password", name: "password", type: "password", validate: (e) => { if (!e)
                return "password is invalid"; return true; } },
    ]);
    const email_config = await inquirer_1.default.prompt([
        { message: "Enter Sender e.g MyCompany", name: "from", type: "input", validate: (e) => { if (!e)
                return "from is invalid"; return true; } },
        { message: "Enter Email Subject", name: "subject", type: "input", validate: (e) => { if (!e)
                return "subject is invalid"; return true; } },
        { message: "Enter Email Body/Content/Html", name: "content", type: "input", validate: (e) => { if (!e)
                return "contect is invalid"; return true; } },
    ]);
    if (!fs_1.default.existsSync(emailListUri)) {
        log_1.default.warn("\t \tNo Valid Mail List Found (404)");
        log_1.default.log("\t create payload.txt in application directory to continue");
        const shouldCreate = await inquirer_1.default.prompt([{ message: "Type 'Y' or 'YES' to create file", type: "confirm", name: "create" }]);
        if (shouldCreate.create) {
            fs_1.default.writeFileSync(emailListUri, "");
            log_1.default.info(`File created created successfully`);
            log_1.default.warn(emailListUri);
        }
        else {
            log_1.default.log("application ended... bye bye");
            process.exit(0);
        }
    }
    log_1.default.log("loading payload.txt");
    const emailList = fs_1.default.readFileSync(emailListUri, "utf8").split(",");
    log_1.default.info(`Found ${emailList.length} entries in payload`);
    new mailer_1.default(email_config.from, email_config.subject, email_config.content, emailList, smtp_credentials);
})();
