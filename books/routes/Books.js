const express = require('express');
const router = express.Router();
const Book = require('../models/Books')
const { TextEncoder, TextDecoder } = require("util");

router.get('/allBooks',async(req,res)=>{
    try {
        const allBooks =await Book.find();
        res.json(allBooks);
    } catch (error) {
        res.json(error.message);
    }
});
router.get('/bookById/:bookId',async(req,res)=>{
    try {
        const book = await Book.findOne({_id : req.params.bookId});
        res.json(book);    
    } catch (error) {
        res.json(error);
    }
})
router.post('/newBook',async (req,res)=>{
    try {
        const book = new Book({
            title : req.body.title,
            author : req.body.author,
            price : req.body.price,
            quantity : req.body.quantity,
            available : req.body.available
        });
        console.log(res)
        const newBook=await book.save();
        res.json(newBook);
    } catch (error) {
        res.json(error);
    }
});
router.patch('/updateBook/:bookId',async (req,res)=>{
    try {
        const updatedBook = await Book.findOneAndUpdate({_id : req.params.bookId},
            {$set : {title : req.body.title,author : req.body.author,price : req.body.price,available : req.body.available,quantity : req.body.quantity}})
            res.json({success : true});
    } catch (error) {
        res.json(error);
    }
});
router.delete('/deleteBook/:bookId',async(req,res)=>{
    try {
        const removedBook = await Book.remove({_id : req.params.bookId});
        res.json(removedBook);
    } catch (error) {
        res.json(error);
    }
})


module.exports = router;