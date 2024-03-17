const date = new Date();
const year = date.getFullYear();
const month = (1 + date.getMonth()).toString().padStart(2, '0');
const day = date.getDate().toString().padStart(2, '0');
const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');
const seconds = date.getSeconds().toString().padStart(2, '0');

// create date with yyyymmdd format
export const formatDate = () => {
    return `${year}${month}${day}`;
}

// create date with "yyyymmdd_hhmmss" format
export const formatDateTime = () => {
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

// create date with FYyyyyMmm format
export const formatFYyyyyMmm = () => {
    return `FY${year}M${month}`;
}