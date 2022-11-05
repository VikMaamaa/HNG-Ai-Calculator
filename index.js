const express = require('express')
const { Configuration, OpenAIApi } = require("openai");
const morgan = require("morgan")

const cors = require("cors")

require("dotenv").config()


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



//handles uncaught errors
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! Shutting Down....')
    process.exit(1);
})


const app = express()



app.use(morgan("dev"))

app.use(express.json({ limit: '10kb' }));
app.use(cors()) 

//  app.use('/', async(req, res)=>{
//     res.status(200).json({
//         slackUsername: 'vik maamaa',
//         backend: true,
//         age: 22,
//         bio: 'I am a developer that loves problem solving, dedicated and love to help others'
// })
//  });

 app.route('/').post(async(req,res)=>{

    
      let countCharacters = (string, letter) => {
        let count = 0;
        for (let i = 0; i < string.length; i++) {
          if (string[i] === letter) {
            count++;
          } 
        }
        console.log('occur', count)
        return count
      };
  
    const Ops = {
        addition: "addition",
        subtraction: "subtraction",
        multiplication: "multiplication",
      
    }

    let val = req.body?.operation_type
    let x = req.body?.x
    let y = req.body?.y
    let resu
    
    switch (val) {
        case Ops.addition:
            console.log('here')
            resu = x + y
            break;
        case Ops.subtraction:
                resu = x - y
                break;
        case Ops.multiplication:
                    resu = x * y
                    break;    
        default:
            const response = await openai.createCompletion({
                model: "text-davinci-002",
                prompt: "they are numbers,  " + val,
                temperature: 0,
                max_tokens: 100,
                top_p: 1,
                frequency_penalty: 0.2,
                presence_penalty: 0,
              });
            //   console.log(response.data.choices[0]?.text)

            let tet = response.data.choices[0]?.text
            tet = tet.trim()
            if(x && y) {
                if(tet.indexOf('+') >= 0){
                    val = 'addition'
                    resu = x + y
                }else if(tet.indexOf('-') >= 0){
                    val = 'subtraction'
                    resu = x - y
                }else if(tet.indexOf('*')){
                    val ='multiplication'
                    resu = x * y
                }
            }else if(!x && !y) {
                let ct = countCharacters(tet, '=')
                if(tet.indexOf('+') >= 0){
                    val = 'addition'
                   
    
                    // resu = x + y
                }else if(tet.indexOf('-') >= 0){
                    val = 'subtraction'
                    resu = x - y
                }else if(tet.indexOf('*')){
                    val ='multiplication'
                    resu = x * y
                }

                if(ct  > 1){
                    resu = parseInt(tet.substring(tet.indexOf('=')+1, tet.indexOf('\n')).trim())
                 }else if(ct  == 1) {
                     resu = parseInt(tet.substring(tet.indexOf('=')+1).trim())
                     console.log(resu)
                 }
            }
            break;
    }
   
 
    res.status(200).json({
        slackUsername: "Vik Maamaa", 
        result: resu || '', 
        operation_type: val
    })
 })
//  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


//connection port 
const port = process.env.PORT || 8000

 app.listen(port, ()=>console.log(`Server is running on port ${port}`))


