const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const bookRoutes = require('./routes/books');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// REST API Routes
app.use('/api', bookRoutes);

// GraphQL endpoint
app.use('/graphql', createHandler({
  schema: schema,
  rootValue: resolvers,
}));

// GraphQL Playground
app.get('/playground', expressPlayground({
  endpoint: '/graphql',
  settings: {
    'request.credentials': 'same-origin',
    'schema.polling.enable': false,
  }
}));

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/rest.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rest.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`
Server is running on http://localhost:${PORT}
REST API available at http://localhost:${PORT}/api
GraphQL endpoint at http://localhost:${PORT}/graphql
GraphQL Playground available at http://localhost:${PORT}/playground
  `);
}); 