const express = require('express');
const Book = require('../models/book');
const router = express.Router();

// GET all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    const transformedBooks = books.map(book => ({
      id: book._id,
      title: book.title,
      author: book.author,
      year: book.year
    }));
    res.json(transformedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET book by id
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({
      id: book._id,
      title: book.title,
      author: book.author,
      year: book.year
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new book
router.post('/books', async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      year: req.body.year
    });
    const savedBook = await book.save();
    res.status(201).json({
      id: savedBook._id,
      title: savedBook.title,
      author: savedBook.author,
      year: savedBook.year
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update book
router.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        author: req.body.author,
        year: req.body.year
      },
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({
      id: book._id,
      title: book.title,
      author: book.author,
      year: book.year
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE book
router.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({
      id: book._id,
      title: book.title,
      author: book.author,
      year: book.year
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 