import {UAParser} from "ua-parser-js";

const parser = new UAParser();
const result = parser.getResult();

export const deviceInfo = `${result.browser.name} - ${result.os.name}`;




