const mongoose = require('mongoose')
const review = require("../model/reviewModel")
const validator = require("../validator/validator.js")
const bookModel = require("../model/bookModel")
const moment = require('moment')
const jwt = require("jsonwebtoken")
const { truncate } = require('fs')


//================================================================ createBook ==================================================================//

const createBook = async function (req, res) {
    try {
        let data = req.body
        // ________________________validation____________________

        if (!validator.isValidRequestBody(data)) {
            res.status(400).send({ status: false, message: 'please enter the details' })
            return
        }

    //================title validation=================//

    if (!data.title) {
        return res.status(400).send({ status: false, Message: "please enter Title of book" })
        } 

    if (!validator.isValid(data.title)) {
        return res.status(400).send({ status: false, Message: "please enter Valid Title " })
        }

         let checkTitle = await bookModel.findOne({ title: data.title, isDeletd: false })

   if (checkTitle) {
        return res.status(400).send("there is already book present with this Title");
            }

    //============= excerpt validation ===============//  

    if (!data.excerpt) {
        return res.status(400).send({ status: false, Message: "please enter excerpt of book" })
        }

    if (!validator.isValid(data.excerpt)) {
        return res.status(400).send({ status: false, Message: "please enter Valid excerpt" })
       }  

       //============= userId validation ===============//  

     if (!data.userId) {
        return res.status(400).send({ status: false, Message: "please enter userId " })
        }
        
    if (!validator.isValidObjectId(data.userId)) {
        return res.status(400).send({ status: false, message: `${data.userId} is not a valid user id ` })
        }

        //=============== ISBN validation =================// 

    if (!data.ISBN) {
         return res.status(400).send({ status: false, Message: "please enter ISBN number " })
        }   

    if (!validator.isValid(data.ISBN)) {
        return res.status(400).send({ status: false, Message: "please enter Valid ISBN to create book" })
        }

        let ISBNN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(data.ISBN)
    if (ISBNN = false) {
        return res.status(400).send({ status: false, Message: "please enter Valid ISBN number" })
        }

        let checkISBN = await bookModel.findOne({ ISBN: data.ISBN  , isDeletd:false })
    if (checkISBN) {
         return res.status(400).send({ status: false, message: "there is already book present with this ISBN  number" });
        }

    //===============category validation=================//
    
    if (!data.category) {
        return res.status(400).send({ status: false, Message: "please enter category of book" })
        }

    if (!validator.isValid(data.category)) {
        return res.status(400).send({ status: false, Message: "please enter Valid category" })
       }  

    //===============subCategory validation=================//

      
    if (!data.subcategory) {
        return res.status(400).send({ status: false, Message: "please enter subcategory of book" })
        }

    if (!validator.isValid(data.subcategory)) {
        return res.status(400).send({ status: false, Message: "please enter Valid subcategory" })
       }  

    //===============review validation=================//

    let num = /\d+/.test(data.reviews)
    if (num = false) {
        return res.status(400).send({ status: false, Message: "please enter Valid review number" })
       }
   //============== validation ends here ===============//

        let allData = await bookModel.create(data)
        res.status(201).send({ status: true, msg: "successfully created", data: allData })
    }
    catch (error) {
        res.status(500).send({status:false , message: error.message })
    }
};

//==================================================== getbooks by query param ===================================================================//

const getBooks = async function (req, res) {
    try {
        let info = req.query
        if (!info)
         return res.status(400).send({ status:false , msg: "data is missing" })

         if(info.userId){
         if (!validator.isValidObjectId(info.userId)) {
            return res.status(400).send({ status: false, message: `${info.userId} is not a valid user id ` })
            }
        }

        findData = await bookModel.findOne({
            $or:
               [{ userId: info.userId }, { category: info.category }, { subcategory: info.subcategory }]
            })

        if (!findData)
           return res.status(400).send({ status:false ,  msg: "No such book exist with this info" })

        res.status(200).send({status:true, message:"we got this books" , data : findData })
    }
    catch (error) {
        res.status(500).send({  status:false , msg: error.message })
    }
}

//======================================================== get books by id == ===================================================================//

let getbookbyId = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        if (!validator.isValidObjectId(bookId)) {
         return res.status(400).send({ status: false, msg: "bookId is incorrect" })
        }

        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });

        if (!book) {
            return res.status(404).send({ status: false, msg: "No such books exists" });
        }

        const reviewdata = await review.find({ bookId: bookId, isDeleted: false });

        return res.status(200).send({ status: true, message: 'Books list', data: { data: book, "reviewsData": reviewdata } });

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};

//============================================================ Update Book ======================================================================//


const updateBook = async function (req, res) {
    try {
        const params = req.params
        const bookId = params.bookId
         
         //================ BookId validation =================//

        if (!validator.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id ` })
            return
        }

        let book = await bookModel.find({ _id: bookId, isDeleted: false });

        if (!book) {
            return res.status(400).send({status:false, message:"No such book exists" });
        }

        let bookData = req.body;

         //================ BookData validation =================//

        if (!validator.isValidRequestBody(bookData)) {
            res.status(400).send({ status: true, message: 'No parameters passed. Book unModified' })
            return
        }

         //================ extracting params  =================//

          let title = bookData.title
          let excerpt = bookData.excerpt
          let ISBN = bookData.ISBN

          
         //================ title validation =================//

        if (bookData.title) {
            if (!validator.isValid(bookData.title)) {
                return res.status(400).send({ status: false, Message: "please enter Valid Title to update" })
            }

            let checkTitle = await bookModel.findOne({ title: bookData.title, isDeletd: false })
            if (checkTitle) {
                return res.status(400).send({status:false , message:"there is already book present with this Title"});
            }
        }

        //================ excerpt validation =================//

        if (bookData.excerpt) {
            if (!validator.isValid(excerpt)) {
                return res.status(400).send({ status: false, Message: "please enter Valid excerpt to update" })
            }
        }
       //================ ISBN Number validation =================//

        if (ISBN) {
            if (!validator.isValid(ISBN)) {
                return res.status(400).send({ status: false, Message: "please enter Valid ISBN to update" })
            }

            let ISBNN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)
            if (ISBNN = false) {
                return res.status(400).send({ status: false, Message: "please enter Valid ISBN to update" })
            }

            let checkISBN = await bookModel.findOne({ ISBN: ISBN })
            if (checkISBN) {
                return res.status(400).send({ status: false, message: "there is already book present with this ISBN  number" });
            }
        }

        //================ Validation Ends Here =================//

        if (bookData)
            bookData["releasedAt"] = new Date();

        let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, bookData, { new: true });
        return res.status(201).send({ status: true, data: updatedBook });
    }

    catch (err) {
        console.log("this is the error:", err.message)
        return res.status(500).send({ msg: "error", error: err.message })
    }
}


//============================================================ Delete Book ======================================================================//

const deletedBook = async function (req, res) {
    try {
        let data = req.params.bookId

        if (!data)
         return res.status(400).send({ status:false , msg: "Please emter bookId "})

         if (!validator.isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: `${data} is not a valid book id ` })
         }

        let dBook = await bookModel.findOneAndUpdate({ _id: data }, { $set: { isDeleted: true, deletedAt: Date() } }, { new: true })

        if (!dBook) return res.status(400).send({ status:false , msg: "did not found any book with this id " })

        res.status(200).send({status:false , message:"Book Deleted Successfully" , data: dBook })
    }

    catch (err) {
         res.status(500).send({status:false , message: err.message}) 
        }
};


module.exports = { createBook, getbookbyId, updateBook, getBooks, deletedBook }



module.exports = { createBook, getbookbyId, updateBook, getBooks, deletedBook }

