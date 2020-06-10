class Log {


    private Reset: string = "\x1b[0m";
    private Bright: string = "\x1b[1m";
    private Dim: string = "\x1b[2m";
    private Underscore: string = "\x1b[4m";
    private Blink: string = "\x1b[5m";
    private Reverse: string = "\x1b[7m";
    private Hidden: string = "\x1b[8m";

    private FgBlack: string = "\x1b[30m";
    private FgRed: string = "\x1b[31m";
    private FgGreen: string = "\x1b[32m";
    private FgYellow: string = "\x1b[33m";
    private FgBlue: string = "\x1b[34m";
    private FgMagenta: string = "\x1b[35m";
    private FgCyan: string = "\x1b[36m";
    private FgWhite: string = "\x1b[37m";

    private BgBlack: string = "\x1b[40m";
    private BgRed: string = "\x1b[41m";
    private BgGreen: string = "\x1b[42m";
    private BgYellow: string = "\x1b[43m";
    private BgBlue: string = "\x1b[44m";
    private BgMagenta: string = "\x1b[45m";
    private BgCyan: string = "\x1b[46m";
    private BgWhite: string = "\x1b[47m";


    public log(msg: any) {
        console.log(this.FgWhite, msg);
        return console.log(this.Reset);
    }

    public info(msg: any) {
        console.log(this.FgBlue, msg);
        return console.log(this.Reset);
    }

    public warn(msg: any) {
        console.log(this.FgYellow, msg);
        return console.log(this.Reset);
    }


    public error(msg: any) {
        console.log(this.FgRed, msg);
        return console.log(this.Reset);
    }

    public success(msg: any) {
        console.log(this.FgGreen, msg);
        return console.log(this.Reset);
    }

    public reset() {
        return console.log(this.Reset);
    }
}

const log = new Log();

export default log;