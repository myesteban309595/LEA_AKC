import {mongoose} from 'mongoose'
import { URI } from '../keys/key.js';
import bcrypt from 'bcrypt';
import moment from 'moment';

import usersModel from '../models/users.models.js';
import productsModel from '../models/products.model.js';
import ComentaryModel from '../models/comentaries.model.js'
import VideoModel from '../models/videos.model.js'

const db = 
    (async () => {
    await mongoose.connect(URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(()=> {
        console.log("conectado a la base de datos:");
    })
    .catch((error)=> {
        console.log("error al conectar a la base de datos:",error);
    })

    const existsUser = await usersModel.find();
    const adminPassword = await bcrypt.hash("admindevelop", 10);

    if(existsUser.length === 0){
        new usersModel({
          fisrtName:"marlon yoel",
          lastName: "esteban valencia",
          rol: "admin",
          email: "peluditostrendydevelop2023@gmail.com",
          address: "cucuta",
          phone: "3104562356",
          address: "cucuta",
          password: adminPassword,
          userState: true,
          city: "cucuta",
          photo: "",
          lastConnection: [],
          age: 26,
         }).save()

        const clientPassword = await bcrypt.hash("nathalie123", 10);

        new usersModel({
          fisrtName:"nathalie stefany",
          lastName: "buitrago",
          rol: "client",
          email: "nathalie2023@gmail.com",
          address: "cucuta",
          phone: "3104562356",
          address: "cucuta",
          password: clientPassword,
          userState: true,
          city: "cucuta",
          photo: "",
          lastConnection: [],
          age: 20,
         }).save()
    }
    const existsProduct = await productsModel.find();

    if(existsProduct.length === 0){
        new productsModel({
          productName:"Producto test0",
          reference: "ropa",
          ProductState: true,
          photo: [
            {
              label:'XL',
              price: 29000,
              imgPath:
              'https://www.gordogs.com.co/wp-content/uploads/2020/04/Ropa-para-perros-Adidog-franc-s-Bulldog-Pupreme-camisa-Perro-cortavientos-deporte-Retro-Sudadera-con-capucha-14-1.jpg',
            },
            {
                label:'XS',
                price: 26000,
                imgPath:
                 'https://m.media-amazon.com/images/I/6139jIkPu1L._AC_.jpg'
            },
            {
                label:'M',
                price: 18000,
                imgPath:'https://http2.mlstatic.com/D_NQ_NP_976325-MCO51294636389_082022-O.webp'
            },
            {
                label:'XXL',
                price: 21000,
                imgPath:'https://hips.hearstapps.com/hmg-prod/images/hmprotector-perro-1634736308.jpg?crop=1.00xw:0.668xh;0,0.0384xh&resize=980:*'
            },
          ],
          sizes: ['XL','XS','M','XXL'],
          size :'',
          price: 11111,
          typeOfCurrency: "COP",
         }).save()

        new productsModel({
          productName:"Producto test1",
          reference: "ropa",
          ProductState: true,
          photo: [
            {
              label:'XL',
              price: 20000,
              imgPath:
              'https://www.dhresource.com/0x0/f2/albu/g10/M01/9C/39/rBVaVlwxchaAbj92AAHa-BrMYiw089.jpg',
            },
            {
                label:'XS',
                price: 25000,
                imgPath:
                 'https://m.media-amazon.com/images/I/6115Vqfnz1L._AC_SL1200_.jpg'
            },
          ],
          sizes: ['XL','XS'],
          size :'',
          price: 22222,
          typeOfCurrency: "COP",
         }).save()
        }
       
        const existsComentary = await ComentaryModel.find();
        
        moment.locale('es');  // Configurar el idioma a español
        
        const fecha = moment("2023-08-10 08:30");
        const fechaFormateada = fecha.format('MMMM D [a las] H:mm');

        if(existsComentary.length === 0){
         new ComentaryModel({
          createdAt: fechaFormateada,
           comentary: "saludo",
           userName : "admin",
           userPhoto: "https://www.pngmart.com/files/21/Admin-Profile-PNG-Image.png",
           userId : "adminId",
           module: "All",
           replies: [
            {
             userId:"testingid1",
             userPhoto: "https://www.ohchr.org/sites/default/files/styles/hero_5_image_desktop/public/2022-11/women-rights-main-image.jpg?itok=RRGl2PFb",
             userName:"Paola Lopez",
             comentary:"jajajajajaja LOL",
             createdAt: fechaFormateada
            },
            {
             userId:"testingid2",
             userPhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9raCKCt83TIRyUPk8n1IDOk1C0subpj9wdQ&usqp=CAU",
             userName:"Camilo torres",
             comentary:"me gusta este comentario",
             createdAt: fechaFormateada
            },
            {
             userId:"testingid3",
             userPhoto: "https://amqueretaro.com/wp-content/uploads/2020/07/Empoderan-trayectorias-de-mujeres-con-foro-LibreDeSer.jpg",
             userName:"Cinthya guzman",
             comentary:"jajajajajaja LOL",
             createdAt: fechaFormateada
            },
            {
             userId:"testingid4",
             userPhoto: "https://www.eltiempo.com/files/image_640_428/files/crop/uploads/2022/08/17/62fd2f460299c.r_1674769026807.0-0-3000-1502.jpeg",
             userName:"Jose Albeiro",
             comentary:"jajajajajaja LOL",
             createdAt: fechaFormateada
            },
          ],
          likes: ["hola", "comentario", "administrador"]
         }).save()
        }

        const existsVideo = await VideoModel.find();
        
        if(existsVideo.length === 0){

         new VideoModel({
          title: "Que ternura ! 😍",
          insertionCode :  '<iframe width="345" height="200" src="https://www.youtube.com/embed/qc4_pAbBafM" title="小狗清洁时间到，沉浸式小狗spa（带好耳机）#柴犬 #多巴胺 #豆柴 #抖音 #柴犬可愛い" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
          moduleRute: "productos",
         }).save()

         new VideoModel({
          title: "Hoy me siento cool! 😎",
          insertionCode : '<iframe width="345" height="200" src="https://www.youtube.com/embed/dMy6-YskDBc" title="Perrito luciendo hermosos atuendo :D" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
          moduleRute: "productos",
         }).save()

         new VideoModel({
          title: "Que tal chicos ? bienvenidos! 😃",
          insertionCode : '<iframe width="345" height="200" src="https://www.youtube.com/embed/dO5zpQtWBKU" title="😍Las Mascotas Bebes mas Tiernas y Bonitas #1😍 | Cute Baby Pets" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
          moduleRute: "inicio",
         }).save()
        }

})();

export default db
