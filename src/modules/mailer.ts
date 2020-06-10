import * as NodeMailer from "nodemailer";
import fs from "fs";
import inquire from "inquirer";
import log from "./log";
import Mail from "nodemailer/lib/mailer";



/**
 * Mail Handler
 */
export default class MailClass {

    private failed: Array<IMail> = [];
    private success: Array<IMail> = [];
    private pending: Array<IMail> = [];
    ui = new inquire.ui.BottomBar();


    transport: Mail = null as any;


    /**
     * Mail class constructor
     * @param data IMailPayload (required)
     */
    constructor(from: string, subject: string, content: string, private list: Array<string>, private smtp_credentials: ISMTP_CREDENTIALS) {

        if (!this.list || list.length == 0) {
            log.warn("empty mailing list");


            return;
        }
        if (!smtp_credentials.username) {
            log.error("username is required");


            return;
        }
        if (!smtp_credentials.password) {
            log.error("password is required");

            return;
        }



        // smtp configurations
        this.transport = NodeMailer.createTransport({
            host: 'mail.privateemail.com',
            port: 465,
            secure: true,
            auth: {
                user: smtp_credentials.username,
                pass: smtp_credentials.password
            }
        });


        // parse list to valid mail data
        this.pending = this.list.map((email) => {
            const data: IMail = {} as IMail;
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

        this.send(this.pending.pop() as IMail);
    }








    /**
     * Initiate sending process via nodemailer SMTP protocol
     */
    async send(data: IMail): Promise<any> {

        try {

          


            // initiate sending process
            await this.transport.sendMail({ from: data.from, subject: data.subject, to: data.to, html: data.content, });


            //update mail status
            data.status = "success";

            this.success.push(data);

            // return success response
            return { code: 200, message: 'sent' };

        } catch (err) {
            console.log(err);
            // update mail status
            data.status = "failed";

            this.failed.push(data);

            // update metadata with insight to event occurred
            data.metadata = { error: err.message };

            // return failed response
            return { code: 500, message: 'failed' }

        } finally {
            log.reset()
            const msg = `${data.to[0]} => ${data.status}`;
            if (data.status === "success")
                log.success(msg);
            else if (data.status === "failed")
                log.error(msg);
            else
                log.warn(msg);

            log.reset()



            if (this.pending.length > 0) {
                return this.send(this.pending.pop() as IMail)
            } else {
                this.ui.updateBottomBar(`Sent: ${this.success.length}, Failed: ${this.failed.length}, Pending: ${this.pending.length}`);

                return;

            }
        }
    }







    //   /**
    //    * Send a normal notification 
    //    */
    //   async notification() {
    //     this.data.content = HtmlPacer.renderHtml(`/build/html/notification.html`, { title: this.data.subject, body: this.data.content }).data;
    //     return this.send();
    //   }






    //   /**
    //    * Send a verification mail that contains an otp code
    //    */
    //   async verification() {
    //     this.data.content = HtmlPacer.renderHtml(`/build/html/verification_code.html`, { title: this.data.subject, code: this.data.content }).data;
    //     this.data.subject = "Verification"
    //     return this.send();
    //   }








    //   /**
    //    * Save sent mails
    //    */
    //   private async save(): Promise<IResult<any>> {
    //     const payload: IMail = this.data;
    //     payload.content = Encrypt.encrypt(this.data.content);
    //     return await MDBConnect.insertOne<IMail>("mail-box", this.data);
    //   }


    private async insertOne(fileName: string, data: string) {
        return new Promise((res, rej) => {

            if (fs.existsSync(`${process.cwd()}/${fileName}`) == false)
                return rej({ message: "File Not Found" });

            //contect

        })
    }

}
