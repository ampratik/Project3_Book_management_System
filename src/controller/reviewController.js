const { response } = require("express")
const mongoose = require ("mongoose")
const moment = require('moment')
const bookModel = require("../model/bookModel")
const reviewModel = require ("../model/review")
//const bookModel =require("../model/bookModel")

const createReview = async function (req,res){
  try{  let data = req.body
    if (!Object.keys(data).length) return res.status(400).send({msg:"body should not be empty"})
    if (!data.reviewedBy) return res.status(400).send({msg:"reviewedBy is mandatory"})
    if(!data.rating) return  res.status(400).send({msg:"rating is missing"})
    if(!data.bookId) return  res.status(400).send({msg:"bookId doesn't match"})
    let x = await bookModel.findOne({_id:data.bookId , isDeleted: false})
    if (!x) return res.status(404).send({msg:"book not found"})

    let allData = await reviewModel.create(data)
    res.status(201).send({status:true, msg:allData})
}
catch(error){
    res.status(500).send({msg:error.message})}
}



// const updateReview = async (req,res)=>{
//   let data =req.params.reviewId
//   let a = req.body
//   let review = await reviewModel.findOne({_id:data , isDeleted: false})
//   console.log(review)
//    let BookId =review.bookId
//   // console.log(BookId)

//   let book = await bookModel.findOne({_id:BookId, isDeleted: false})
//   console.log(book)
//   if(!book ) return res.status(400).send({msg:"bookId is deleted"})
//   const rUpdate= await reviewModel.findOneAndUpdate({_id:data},{$set:a},{new:true})
//   res.status(200).send({msg:rUpdate})
// }

const updateReview = async (req,res)=>{
 try{
      let data =req.params.bookId
    let r = req.params.reviewId
     let a = req.body

     let findReview = await reviewModel.findOne({_id:r ,isDeleted:false})
     let b= findReview.bookId.toString()
    // console.log(findReview)
     let findBook = await bookModel.findOne({_id:data, isDeleted: false})
    let c =findBook._id.toString()

     if( b!==c) return res.status(400).send ({msg:"id doesn't match"})

     let update = await reviewModel.findOneAndUpdate({_id: r}, {$set:a},{new:true})

    return  res.status(201).send({msg:"update successfully" ,data:update})
}
catch(error)
{ return res.status(500).send({msg:error.message})}
}



const deleteReview = async (req,res)=>{
  try{
    let data =req.params.bookId
  let r = req.params.reviewId
   let a = req.body

   let findReview = await reviewModel.findOne({_id:r ,isDeleted:false})
   let b= findReview.bookId.toString()
   let findBook = await bookModel.findOne({_id:data, isDeleted: false})
  let c =findBook._id.toString()
   if( b!==c) return res.status(400).send ({msg:"id doesn't match"})
   let dBook = await bookModel.findOneAndUpdate({_id:findBook._id},{$inc:{reviews:-1}},{new:true})
   let dReview = await reviewModel.findOneAndUpdate({_id:r,isDeleted: false},{isDeleted:true },{new:true})
   return res.status(200).send({msg:{ dReview,reviews:dBook}})
}
catch(error){
  res.status(500).send({msg :error.message})}
}


module.exports ={createReview,updateReview,deleteReview}