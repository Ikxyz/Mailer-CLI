import Mail from "./modules/mailer";
import CLI from 'inquirer';
import log from "./modules/log";
import fs from "fs";
const _package: any = require("../package.json");

const emailListUri = `${process.cwd()}/payload.txt`;






(async () => {


    log.info(`Custom Mailer ${_package.version}`);

    const smtp_credentials: ISMTP_CREDENTIALS = await CLI.prompt([
        { message: "Enter SMTP username", name: "username", type: "input", validate: (e) => { if (!e) return "username is invalid"; return true } },
        { message: "Enter SMTP password", name: "password", type: "password", validate: (e) => { if (!e) return "password is invalid"; return true } },
    ]);

    const email_config: { subject: string, content: string, from: string } = await CLI.prompt([
        { message: "Enter Sender e.g MyCompany", name: "from", type: "input", validate: (e) => { if (!e) return "from is invalid"; return true } },
        { message: "Enter Email Subject", name: "subject", type: "input", validate: (e) => { if (!e) return "subject is invalid"; return true } },
        { message: "Enter Email Body/Content/Html", name: "content", type: "input", validate: (e) => { if (!e) return "contect is invalid"; return true } },
    ])

    if (!fs.existsSync(emailListUri)) {
        log.warn("\t \tNo Valid Mail List Found (404)");
        log.log("\t create payload.txt in application directory to continue");

        const shouldCreate = await CLI.prompt([{ message: "Type 'Y' or 'YES' to create file", type: "confirm", name: "create" }])

        if (shouldCreate.create) {
            fs.writeFileSync(emailListUri, "");
            log.info(`File created created successfully`)
            log.warn(emailListUri);
        }
        else {
            log.log("application ended... bye bye");
            process.exit(0);
        }
    }


    log.log("loading payload.txt");
    const emailList = fs.readFileSync(emailListUri, "utf8").split(",");
    log.info(`Found ${emailList.length} entries in payload`);
    new Mail(email_config.from, email_config.subject, email_config.content, emailList, smtp_credentials);
})();