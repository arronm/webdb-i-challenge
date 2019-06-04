const express = require('express');
const db = require('./data/accounts-model.js');
const server = express();
server.use(express.json());

const errorRef = (error) => {
  const hash = Math.random().toString(36).substring(2);
  console.log(`${hash}: ${error}`);
  return {
    message: `Unknown Server Error, Reference: ${hash}`,
  };
};

const validateID = async (req, res, next) => {
  try {
    const account = await db.findById(req.params.id);
    if (!account) {
      return res.status(400).json({
        message: `Account ID (${req.params.id}) does not exist`,
      });
    }
    req.account = account;
    next();
  } catch (error) {
    res.status(500).json(errorRef(error));
  }
};

const validateAccount = (req, res, next) => {
  if (!req.body.name || !req.body.budget) return res.status(400).json({
    message: `Missing field \`${!req.body.name ? 'name' : 'budget'}\``,
  });

  if (typeof req.body.budget !== 'number') return res.status(400).json({
    message: `Budget field must be an integer`,
  });

  next();
}

// GET
server.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await db.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).json(errorRef(error));
  }
});

server.get('/api/accounts/:id', validateID, (req, res) => {
  res.json(req.account);
});

// POST
server.post('/api/accounts', validateAccount, async (req, res) => {
  try {
    const account = await db.add(req.body);
    res.status(201).json(account);
  } catch (error) {
    if (error.message.indexOf('UNIQUE') >= 0) return res.status(400).json({
      message: `Account name (${req.body.name}) is not unique`,
    });

    res.status(500).json(errorRef(error));
  };
});

// PUT
server.put('/api/accounts/:id', validateID, async (req, res) => {
  try {
    const account = {
      ...req.account,
      ...req.body,
    };

    await db.update(req.account.id, account);
    res.json(account);
  } catch (error) {
    res.status(500).json(errorRef(error));
  }
});

// DELETE
server.delete('/api/accounts/:id', validateID, async (req, res) => {
  try {
    await db.remove(req.account.id);
    res.json(req.account);
  } catch (error) {
    res.status(500).json(errorRef(error));
  }
});

module.exports = server;
