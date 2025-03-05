const Book = require('../models/book');

const resolvers = {
  books: async () => {
    try {
      const books = await Book.find();
      return books.map(book => ({
        id: book._id,
        title: book.title,
        author: book.author,
        year: book.year
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  book: async ({ id }) => {
    try {
      const book = await Book.findById(id);
      if (!book) return null;
      return {
        id: book._id,
        title: book.title,
        author: book.author,
        year: book.year
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  createBook: async ({ input }) => {
    try {
      const book = new Book(input);
      const savedBook = await book.save();
      return {
        id: savedBook._id,
        title: savedBook.title,
        author: savedBook.author,
        year: savedBook.year
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateBook: async ({ id, input }) => {
    try {
      const book = await Book.findByIdAndUpdate(
        id,
        input,
        { new: true }
      );
      if (!book) return null;
      return {
        id: book._id,
        title: book.title,
        author: book.author,
        year: book.year
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteBook: async ({ id }) => {
    try {
      const book = await Book.findByIdAndDelete(id);
      if (!book) return null;
      return {
        id: book._id,
        title: book.title,
        author: book.author,
        year: book.year
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = resolvers; 