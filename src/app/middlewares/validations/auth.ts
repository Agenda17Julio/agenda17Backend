import { usernameVal,passwordVal } from './index';


const AuthVal = ():Array<any> => [
    usernameVal(),
    passwordVal()
];

export default AuthVal;