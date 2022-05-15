<<<<<<< HEAD
const { response } = require("express")
const mongoose = require("mongoose")
const moment = require('moment')
const bookModel = require("../model/bookModel")
const reviewModel = require("../model/review")
=======
const mongoose = require("mongoose")
const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
>>>>>>> d4c1c3be266ebff6abf129d2cd97acd6abf4ce48
const validator = require("../validator/validator")


//============================================================== Create Review =================================================================//

const createReview = async function (req, res) {
  try {
    const params = req.params
    const bookId = params.bookId

    //================ BookId validation from params =================//

    if (!validator.isValidObjectId(bookId)) {
      res.status(400).send({ status: false, message: `${bookId} is not a valid book id ` })
      return
    }

    let book = await bookModel.find({ _id: bookId, isDeleted: false });

    if (!book) {
      return res.status(400).send({ status: false, message: "No such book exists" });
    }

    let bookData = req.body;

    //================ BookData validation =================//

    if (!validator.isValidRequestBody(bookData)) {
      res.status(400).send({ status: true, message: 'No parameters passed. Book unModified' })
      return
    }

    //================ extracting parameters  =================//

    const review = bookData.review
    const reviewedBy = bookData.reviewedBy
    const rating = bookData.rating
    const BookId = bookData.bookId

    //================  BookId validations  =================//

    if (!BookId) {
      return res.status(400).send({ status: false, message: " Please enter Your bookId " })
    }

    if (!validator.isValidObjectId(BookId)) {
      return res.status(400).send({ status: false, message: `${bookId} is not a valid book id ` })
    }

    if (!(params.bookId === bookData.bookId)) {
      return res.status(400).send({ status: false, message: "BookIds are different " })
    }

    //================ reviewBy validation =================//

    if (typeof reviewedBy === "string" && reviewedBy.trim().length === 0) {
      return res.status(400).send({ status: false, Message: "please enter Valid reviewedBy" })
    }

    //================ review validation =================//

    if (!validator.isValid(review)) {
      return res.status(400).send({ status: false, Message: "please enter Valid review" })
    }

    //================ rating validation =================//

    if (!rating) {
      return res.status(400).send({ status: false, message: " Please enter Your rating " })
    }

    if (!(rating >= 1 && rating <= 5)) {
      return res.status(400).send({ status: false, msg: "Rating should be in between 1-5 " })
    }

    //================ validation End Here ===================//

    const Book = await bookModel.findOneAndUpdate({ _id: BookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true })

    let BookReview = await reviewModel.create(bookData)
    res.status(201).send({ status: true, Data: { Book, reviewdata: BookReview } })

  }

  catch (error) {
    res.status(500).send({ status: false, message: "server error", msg: error.message })
  }
}

//=============================================================== Update Review ==================================================================//


<<<<<<< HEAD
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

const updateReview = async (req, res) => {
  try {
    let data = req.params.bookId
    let r = req.params.reviewId
   // if (!data) return res.status.send(msg: "bookId cant be empty")
  //   if (!validator.isValidObjectId(data)) return res.status(400).send({ msg: "its not a proper bookId" })

  //  // if (!r) return res.status.send(msg: "reviewId cant be empty")
  //   if (!validator.isValidObjectId(r)) return res.status(400).send({ msg: "its not a proper reviewId" })

    let a = req.body

    let findReview = await reviewModel.findOne({ _id: r, isDeleted: false })

    let b = findReview.bookId.toString()
    // console.log(findReview)
    let findBook = await bookModel.findOne({ _id: data, isDeleted: false })
    let c = findBook._id.toString()

    if (b !== c) return res.status(400).send({ msg: "id doesn't match" })

    let update = await reviewModel.findOneAndUpdate({ _id: r }, { $set: a }, { new: true })

    return res.status(201).send({ msg: "update successfully", data: update })
  }
  catch (error) { return res.status(500).send({ msg: error.message }) }
}

//🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼Delete review🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼

const deleteReview = async (req, res) => {
  try {
    let data = req.params.bookId
    let r = req.params.reviewId

    // review validation  //
    if (!r) return res.status(400).send({ msg: "reviewId cant be empty" })
    if (!validator.isValidObjectId(r)) return res.status(400).send({ msg: "its not a proper reviewId" })
    let findReview = await reviewModel.findOne({ _id: r, isDeleted: false })
    if (!findReview) return res.status(400).send({ msg: "reviewId is not active" })
    let b = findReview.bookId.toString()

    // book validation  //
    if (!data) return res.status(400).send({msg: "bookId cant be empty"})
    if (!validator.isValidObjectId(data)) return res.status(400).send({ msg: "its not a proper bookId" })
    let findBook = await bookModel.findOne({ _id: data, isDeleted: false })
    if (!findBook) return res.status(400).send({ msg: "BookId is not active" })
    let c = findBook._id.toString()

    if (b !== c) return res.status(400).send({ msg: "id doesn't match" })
    let dBook = await bookModel.findOneAndUpdate({ _id: data }, { $inc: { reviews: -1 } }, { new: true })
    console.log(dBook)
    let dReview = await reviewModel.findOneAndUpdate({ _id: r, isDeleted: false }, { isDeleted: true }, { new: true })
    return res.status(200).send({ msg: { dReview, reviews: dBook } })
  }
  catch (error) {
    res.status(500).send({ msg: error.message })
=======
const updateReview = async function (req, res) {
  try {
    let bookId = req.params.bookId
    let reviewId = req.params.reviewId
    let reviewData = req.body

    //================ BookId validation =================//

    if (!validator.isValidObjectId(bookId)) {
      return res.status(400).send({ status: false, message: `${bookId} is not a valid book id ` })
    }
    let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })

    if (!findBook) {
      return res.status(400).send({ status: false, message: "No such book exists" });
    }


    //================ reviewId validation =================//

    if (!validator.isValidObjectId(reviewId)) {
      return res.status(400).send({ status: false, message: `${reviewId} is not a valid reviewId ` })

    }

    let findReview = await reviewModel.findOne({ _id:reviewId , isDeleted: false })

    if (!findReview) {
      return res.status(400).send({ status: false, message: "No such review exists" });
    }

    console.log(findBook._id)
    let Book = findBook._id.toString()
    let Review = findReview.bookId.toString()
    

    if (Book != Review) { return res.status(400).send({ msg: "id doesn't match" }) }

    //================ reviewData validation =================//

    if (!validator.isValidRequestBody(reviewData)) {
      return res.status(400).send({ status: true, message: 'No parameters passed. review unModified' })

    }

    //================ extracting params  =================//

    let review = reviewData.review
    let rating = reviewData.rating
    let reviewedBy = reviewData.reviewedBy

  

    //================review validation =================//

    if (review) {
      if (!validator.isValid(review)) {
        return res.status(400).send({ status: false, Message: "please enter Valid review e to update" })}
      }
    
      //================ reviewedBy validation =================//

      if (reviewedBy) {
        if (!validator.isValid(reviewedBy)) {
          return res.status(400).send({ status: false, Message: "please enter Valid  reviewedBy to update" })
        }
      }
      ////======== Rating validation==============///
      if(rating){
      if (!(rating >= 1 && rating <= 5)) {
        return res.status(400).send({ status: false, msg: "Rating should be in between 1-5 " })
      }}
      console.log(rating)

      let update = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: reviewData }, { new: true })
 console.log(update)
      return res.status(201).send({ msg: "update successfully", data: update })
    }
  
  catch (err) {
    console.log("this is the error:", err.message)
    return res.status(500).send({ msg: "error", error: err.message })
>>>>>>> d4c1c3be266ebff6abf129d2cd97acd6abf4ce48
  }
}

<<<<<<< HEAD
// const updateReview = async function (req, res) {
//   try {
//     const bookId = req.params.bookId
//     const reviewId = req.params.reviewId
//     const reviewData = req.body;

<<<<<<< HEAD
module.exports = { createReview, updateReview, deleteReview }
=======
//     //================ BookId validation =================//

//     if (!validator.isValidObjectId(bookId)) {
//       return res.status(400).send({ status: false, message: `${bookId} is not a valid book id ` })

//     }

//     let book = await bookModel.find({ _id: bookId, isDeleted: false });

//     if (!book) {
//       return res.status(400).send({ status: false, message: "No such book exists" });
//     }

//     //================ reviewId validation =================//

//     if (!validator.isValidObjectId(reviewId)) {
//       return res.status(400).send({ status: false, message: `${reviewId} is not a valid reviewId ` })

//     }

//     let Review = await reviewModel.findOne({ $and: [{ _id: reviewId, bookId: bookId, isDeleted: false }] });

//     if (!Review) {
//       return res.status(400).send({ status: false, message: "No such review exists" });
//     }

//     //  if((book._id != Review._bookId)){

//     //   return res.status(400).send ({msg:"id doesn't match"})}
//     //     let b =bookId
//     //     let Re=Review.bookId

//     //  if(b != Re) {return res.status(400).send ({msg:"id doesn't match"})}


//     //================ reviewData validation =================//

//     if (!validator.isValidRequestBody(reviewData)) {
//       return res.status(400).send({ status: true, message: 'No parameters passed. review unModified' })

//     }

//     //================ extracting params  =================//

//     let review = reviewData.review
//     let rating = reviewData.rating
//     let reviewedBy = reviewData.reviewedBy



//     //================review validation =================//

//     if (review) {
//       if (!validator.isValid(review)) {
//         return res.status(400).send({ status: false, Message: "please enter Valid review e to update" })
//       }

//       //     let checkreview  = await reviewModel.findOne({ review :review , isDeletd: false })
//       //     if (checkreview) {
//       //         return res.status(400).send({status:false , message:"there is review   present with this Title"});
//       //     }
//       // }

//       //================rating validation =================//

//       // if(!rating){

//       //         return res.status(400).send({ status: false, Message: "please enter Valid excerpt to update" })
//       //     }
//       // // }
//       //================ reviewedBy validation =================//

//       if (reviewedBy) {
//         if (!validator.isValid(reviewedBy)) {
//           return res.status(400).send({ status: false, Message: "please enter Valid  reviewedBy to update" })
//         }
//       }


//       //================ Validation Ends Here =================//



//       let updatedreview = await reviewModel.findOneAndUpdate({ _id: reviewId }, reviewData, { new: true });
//       console.log(updateReview)
//       return res.status(201).send({ status: true, data: updatedreview });

//     }
//   }
//   catch (err) {
//     console.log("this is the error:", err.message)
//     return res.status(500).send({ msg: "error", error: err.message })
//   }
// }

module.exports = { createReview, updateReview }
>>>>>>> d4c1c3be266ebff6abf129d2cd97acd6abf4ce48
=======


module.exports = { createReview, updateReview }
>>>>>>> 7b4c7e001e33e6c1096f8f3b3fe9d365372ad66c
