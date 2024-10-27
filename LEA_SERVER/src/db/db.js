import {mongoose} from 'mongoose'
import { URI } from '../keys/key.js';
import bcrypt from 'bcrypt';
import moment from 'moment';

const db = 
    (async () => {
    await mongoose.connect(URI)
    .then(()=> {
        console.log("conectado a la base de datos:");
    })
    .catch((error)=> {
        console.log("error al conectar a la base de datos:",error);
    })
})();

export default db
