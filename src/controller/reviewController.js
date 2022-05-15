const mongoose = require("mongoose")
const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
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
  }
}



module.exports = { createReview, updateReview }
