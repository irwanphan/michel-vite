import { formatDate, formatDateFYM, formatDateTime } from "./utils";

// Encode username and password to base64
const username = process.env.USER_NAME;
const password = process.env.USER_PASSWORD;
const encodedCredentials = btoa(`${username}:${password}`);
let headers = new Headers();
headers.set('Authorization', `Basic ${encodedCredentials}`);
headers.set('Content-Type', 'application/json');
export { headers };

// Construct the URL with parameters
const DaytonReg = process.env.DAYTON_REG;
const DaytonSubCode = process.env.DAYTON_SUBCODE;
const date = formatDate()
const datetime = formatDateTime()
const dateFYM = formatDateFYM()

const isProduction = process.env.NODE_ENV === 'production';
const url = isProduction ? `${process.env.URL_PROD}` : `${process.env.URL_DEV}`;

export const submitSalesDetailUrl = `${url}/SalesDetail/SubmitSalesDetail?RDBusinessRegNo=${DaytonReg}&RDSubCode=${DaytonSubCode}&TransDate=${date}`;

export const submitStockDetailUrl = `${url}/Stock/SubmitStockDetail?RDBusinessRegNo=${DaytonReg}&RDFileCode=${DaytonSubCode}&TransDate=${datetime}`;

// export const getSalesDetailUrl = `${url}/SalesDetail/GetSalesDetail?RDBusinessRegNo=${DaytonReg}&RDSubCode=${DaytonSubCode}&TransMonth=${dateFYM}`;
export const getSalesDetailUrl = `${url}/SalesDetail/GetSalesDetail?RDBusinessRegNo=${DaytonReg}&RDSubCode=${DaytonSubCode}&TransMonth=${dateFYM}`;