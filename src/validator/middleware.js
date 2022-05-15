const jwt = require('jsonwebtoken');
const bookModel = require('../model/bookModel');

//================ authorization ======================//

const authorization = async function (req,res,next){
    let token = req.headers['my-api-key']
  
    if(!token) return res.status(400).send({msg:"No token is present in Header file"})
    console.log(token)
     
    let bookId =req.params.bookId 
   let bookDetails= await bookModel.findOne({_id:bookId})
    //console.log(bookDetails)

    let decodedToken = jwt.verify(token,"functionUp_uranium")
    if(!decodedToken) 
    return res.status(401).send({status:false , msg:"token is invalid"})
   // console.log(decodedToken)

    if(bookDetails.userId != decodedToken.userId)
      return res.status(400).send({status:false , msg:"jwt validation failed"})
    next()
}

//================ authentication ======================//

const authentication = async function (req,res,next){
 try{

  let token = req.headers['my-api-key']
  if(!token) 
  return res.status(400).send({status:false , msg:"token required"})
 // console.log(token)

  let decodedToken = jwt.verify(token,"functionUp_uranium")
  if(!decodedToken) 
  return res.status(401).send({status:false , msg:"token is invalid"})

    next()

  }
  catch(error){ 
    return res.status(500).send({status:false , msg:error.message})}
}
//=========================================
const bookAuthorization = async function (req,res,next){
  let token = req.headers['my-api-key']

  if(!token) return res.status(400).send({msg:"No token is present in Header file"})
  console.log(token)
   
  let userId =req.body.userId
 
  let decodedToken = jwt.verify(token,"functionUp_uranium")
  if(!decodedToken) 
  return res.status(401).send({status:false , msg:"token is invalid"})
 // console.log(decodedToken)

  if(userId!=decodedToken.userId)
    return res.status(400).send({status:false , msg:"jwt validation failed"})
  next()
}

module.exports= {authorization,authentication,bookAuthorization}
