# Book Management API

A Node.js application demonstrating the implementation of both REST and GraphQL APIs for managing books, using MongoDB as the database.

## Features

- REST API endpoints for CRUD operations
- GraphQL API with queries and mutations
- MongoDB integration
- GraphQL Playground interface for testing GraphQL queries
- Simple web interface for managing books

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Make sure MongoDB server is running)
- npm or yarn

## Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd bookstore_graphQL_restApi
```
2. Install dependencies:
```sh
npm install express body-parser graphql graphql-http mongoose graphql-playground-middleware-express
```
3. Make sure MongoDB is running on your local machine (default: mongodb://localhost:27017)
4. Start the server:
```sh
node src/index.js
```
## API Endpoints

### REST API (http://localhost:3000/api)

- GET `/api/books` - Get all books
- GET `/api/books/:id` - Get a specific book
- POST `/api/books` - Create a new book
- PUT `/api/books/:id` - Update a book
- DELETE `/api/books/:id` - Delete a book

### GraphQL API

- GraphQL Endpoint: http://localhost:3000/graphql
- GraphQL Playground: http://localhost:3000/playground

Example Queries:

Get all books
```graphql
query {
    books {
        id
        title
        author
        year
    }
}
```
Get a specific book
```graphql
query {
    book(id: "book_id") {
        title
        author
        year
    }
}
```
Create a new book
```graphql
mutation {
    createBook(input: {
        title: "Harry Book"
        author: "Harry"
        year: 1993
    }) {
        id
        title
        author
        year
    }
}
```
Update a book
```graphql
mutation {
    updateBook(
        id: "book_id"
        input: {
            title: "Updated Title"
            author: "Author Name"
            year: 2024
        }
    ) {
        id
        title
        author
        year
    }
}
```
Delete a book
```graphql
mutation {
    deleteBook(id: "book_id") {
        id
        title
    }
}
```
### Web Interface
- http://localhost:3000 - Web interface for managing books

## Project Structure

```
├── src/
│   ├── models/
│   │   └── book.js         # MongoDB model definition
│   ├── graphql/
│   │   ├── schema.js       # GraphQL schema definition
│   │   └── resolvers.js    # GraphQL resolvers
│   ├── routes/
│   │   └── books.js        # REST API routes
│   ├── public/
│   │   ├── index.html      # GraphQL frontend
│   │   └── rest.html       # REST API frontend
│   └── index.js            # Server configuration and setup
├── package.json
└── README.md
```

## Dependencies

- express - Web framework
- mongoose - MongoDB object modeling
- graphql - GraphQL implementation
- graphql-http - GraphQL HTTP server middleware
- body-parser - Request body parsing middleware
- graphql-playground-middleware-express - GraphQL Playground interface

## Development

1. For REST API development:
```bash
nodemon src/index_restapi.js
```

2. For GraphQL API development:
```bash
nodemon src/index_graphql.js
```

## Error Handling

Both APIs include error handling for:
- Database connection errors
- Invalid requests
- Not found errors
- Validation errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
