const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');
const expressPlayground = require('graphql-playground-middleware-express').default;
const mongoose = require('mongoose');
const Book = require('./models/book');
const path = require('path');

const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Define GraphQL Schema
const schema = buildSchema(`
  type Book {
    id: ID!
    title: String!
    author: String!
    year: Int!
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  input BookInput {
    title: String!
    author: String!
    year: Int!
  }

  type Mutation {
    createBook(input: BookInput!): Book
    updateBook(id: ID!, input: BookInput!): Book
    deleteBook(id: ID!): Book
  }
`);

// Define resolvers
const root = {
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

// Set up GraphQL handler
app.use('/graphql', createHandler({
  schema: schema,
  rootValue: root,
}));

// Set up GraphQL Playground at /playground
app.get('/playground', expressPlayground({
  endpoint: '/graphql',
  settings: {
    'request.credentials': 'same-origin',
    'schema.polling.enable': false,
  }
}));

// Update the root route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`
Server is running on http://localhost:${PORT}
GraphQL Playground available at http://localhost:${PORT}
GraphQL endpoint at http://localhost:${PORT}/graphql
  `);
}); 