const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const {userModel}=require('./models/users')
const bcrpt=require('bcrypt')
const jwt=require('jsonwebtoken')
const port = process.env.PORT || 3000


let app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


// CORS Policy
// app.use( (req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','GET','POST');
//     res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type')
//     res.setHeader('Access-Control-Allow-Credentials',true)
//     next()
// } )

mongoose.connect('mongodb+srv://userone:userone@cluster0.vcc0q.mongodb.net/MzcTest',  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } );


  app.get('/api/viewall',(req,res)=>{
      userModel.find((err,data)=>{
          if(err)
          {
            res.status(404).send('Error happened')
  
          }
          else{
              res.send(data)
          }
      })
  })

  app.post('/api/blogpost',(req,res)=>{

    console.log(req.body)

    jwt.verify(req.headers.token,'ictacademy',(err,decoded)=>{
        if(decoded && decoded.email ){
            console.log(req.body)
            res.send('Authorised user')
        }
        else{
            res.send('UnAuthorised user')

        }
    })

  })

  app.post("/api/login",async(req,res)=>{

    try{

        console.log(req.body)
        var userEmail= req.body.email
        var userPass= req.body.password
        let result=  userModel.find({email:userEmail},(err,data)=>{
            if(data.length>0){
                const passwordValidator=bcrpt.compareSync(userPass,data[0].password)
                console.log(passwordValidator)
                if(passwordValidator)
                {
                    // token generation
                    jwt.sign({email:data[0].email,id:data[0]._id},
                        'ictacademy',
                        {expiresIn:'1d'},
                        (err,token)=>{
                            if(err){
                                res.json({status:'error in token generation'})
                            }
                            else{
                                res.json({status:'login success',token:token})
                            }
                        }

                    )


                    /////////


                }
                else{
                    res.json({status:'invalid password'})

                }

            }
            else{
                res.json({status:'invalid email id'})

            }
        })

          


    }
    catch(error)
    {
        res.json({status:'error'})

    }

  })


app.post("/api/register",async(req,res)=>{

    try{

        userModel.find({email:req.body.email},(err,data)=>{
if(data.length==0){

    let user=new userModel({ name: req.body.name, 
        email: req.body.email,
        mobile:req.body.mobile,
        password: bcrpt.hashSync(req.body.password,10) })

    let result= user.save( (err,data)=>{
        if(err){
            res.json({status:'error happened'})

        }
        else{
            res.json({status:'sucesss'})

        }
    } )

}
else{
    res.json({status:'email id already exists'})


}

        })

       

    }
    catch(error)
    {
        res.json({status:'error'})

    }

})


app.listen(port ,()=>{
    console.log("server running ......")
})