import { formatDate, formatDateFYM, formatDateTime } from "./utils";
import { config as dotenvConfig } from "dotenv";
import ElectronStore from 'electron-store'

type ConfigType = {
    dbHost: string,
    dbPort: string,
    dbUsername: string,
    dbPassword: string,
    dbName: string,
    michelinUsername: string,
    michelinPassword: string,
    michelinSubcode: string,
    productionMode: boolean
}

dotenvConfig()
const store = new ElectronStore()
const config = store.get('config') as ConfigType

// Encode username and password to base64
// const username = process.env.USER_NAME;
const username = config.michelinUsername;
// const password = process.env.USER_PASSWORD;
const password = config.michelinPassword;
const encodedCredentials = btoa(`${username}:${password}`);
let headers = new Headers();
headers.set('Authorization', `Basic ${encodedCredentials}`);
headers.set('Content-Type', 'application/json');
export { headers };

// Construct the URL with parameters
// const DaytonReg = process.env.DAYTON_REG;
const DaytonReg = config.michelinUsername;
// const DaytonSubCode = process.env.DAYTON_SUBCODE;
const DaytonSubCode = config.michelinSubcode;
const date = formatDate()
const datetime = formatDateTime()
const dateFYM = formatDateFYM()

const urlProduction = "https://redistribution-approach.michelin.com.my/RAS.WebAPI";
const urlDevelopment = "http://13.67.56.85:8510/RASUAT.WebAPI";

// change this later
// const isProduction = false;
const productionMode = config.productionMode;

const url = productionMode ? `${urlProduction}` : `${urlDevelopment}`;

export const submitSalesDetailUrl = `${url}/SalesDetail/SubmitSalesDetail?RDBusinessRegNo=${DaytonReg}&RDSubCode=${DaytonSubCode}&TransDate=${date}`;
export const submitStockDetailUrl = `${url}/Stock/SubmitStockDetail?RDBusinessRegNo=${DaytonReg}&RDFileCode=${DaytonSubCode}&TransDate=${datetime}`;

// export const getSalesDetailUrl = `${url}/SalesDetail/GetSalesDetail?RDBusinessRegNo=${DaytonReg}&RDSubCode=${DaytonSubCode}&TransMonth=${dateFYM}`;
export const getSalesDetailUrl = `${url}/SalesDetail/GetSalesDetail?RDBusinessRegNo=${DaytonReg}&RDSubCode=${DaytonSubCode}&TransMonth=${dateFYM}`;