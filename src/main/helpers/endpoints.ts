import { formatDate } from "./utils";

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
export const submitSalesDataUrl = `http://13.67.56.85:8510/RASUAT.WebAPI/SalesDetail/SubmitSalesDetail?RDBusinessRegNo=${DaytonReg}&RDSubCode=${DaytonSubCode}&TransDate=${date}`;
export const submitStockDataUrl = `http://13.67.56.85:8510/RAS.WebAPI/Stock/SubmitStockDetail?RDBusinessRegNo=${DaytonReg}&RDFileCode=${DaytonSubCode}&TransDate=${date}`;