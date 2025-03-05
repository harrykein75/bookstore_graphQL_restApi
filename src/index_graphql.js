const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Book = require('./models/book');

const app = express();

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

// Add a simple HTML page with GraphiQL
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>GraphiQL</title>
        <style>
          body { margin: 0; height: 100vh; }
          #graphiql { height: 100vh; }
        </style>
        <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
        <script src="https://unpkg.com/graphiql/graphiql.min.js"></script>
      </head>
      <body>
        <div id="graphiql"></div>
        <script>
          const root = document.getElementById('graphiql');
          const fetcher = GraphiQL.createFetcher({
            url: '/graphql',
          });
          ReactDOM.render(
            React.createElement(GraphiQL, { fetcher }),
            root
          );
        </script>
      </body>
    </html>
  `);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 