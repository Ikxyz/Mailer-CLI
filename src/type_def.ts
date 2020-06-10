// status
type IStatus = "pending" | "success" | "failed"

// standard result data
type IResult<T> = {
    code: number;
    message?: string;
    status?: boolean;
    data?: T | null;
};

// mail data model
interface IMail {
    ref: string;
    from: string; //'FoodMoni <support@foodmoni.com>'
    to: Array<string>;
    subject: string;
    content: string;
    timestamp?: number;
    created_on?: string;
    status?: IStatus;
    metadata: any;
}

interface ISMTP_CREDENTIALS {
    username: string;
    password: string;
}