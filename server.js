const express = require('express');

const server = express();

// GET
server.get('/api/accounts', async (req, res) => {
  res.json({
    message: 'GET Endpoint',
  });
});

server.get('/api/accounts/:id', async (req, res) => {
  res.json({
    message: `GET Endpoint for ID: ${req.params.id}`,
  });
});

// POST
server.post('/api/accounts', async (req, res) => {
  res.json({
    message: 'POST Endpoint',
  });
});

// PUT
server.put('/api/accounts/:id', async (req, res) => {
  res.json({
    message: `PUT Endpoint for ID: ${req.params.id}`,
  });
});

// DELETE
server.delete('/api/accounts/:id', async (req, res) => {
  res.json({
    message: `DELETE Endpoint for ID: ${req.params.id}`,
  });
});

module.exports = server;
