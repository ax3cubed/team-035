/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-trailing-whitespace */
const Transaction = require("../models/transactions");

const transactionList = (req, res) => {
  Transaction.find()
    .populate('businessId')
    .populate('investorId')
    .exec()
    .then((transactions) => {
      if (transactions) {
        return res.status(404).json({ message: 'transactions not found!' });
      } 
      return res.status(200).json(transactions);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const transactionReadOne = (req, res) => {
  const transactionId = req.param.id;
  Transaction.findById(transactionId)
    .populate('businessId')
    .populate('investorId')
    .exec()
    .then((transaction) => {
      if (!transaction) {
        return res.status(404).json({ message: 'transaction not found! ' });
      }
      return res.status(200).json({ data: transaction });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const transactionCreate = (req, res) => {
  Transaction.create({
    businessid: businessId._id,
    investorid: investorId._id,
    amount: req.body.amount,
    wallet: req.body.blockchainWallet
  })
    .then((transaction) => { return res.status(201)
        .json({ data: transaction });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const transactionUpdate = (req, res) => {
  const transactionid = req.param.id;
  if (!transactionid) {
    return res.status(404).json({ message: 'transaction not found!' });
  }
  Transaction.findByIdAndUpdate({
    transactionid,
    $set: {
      amount: req.body.amount,
      wallet: req.body.blockchainWallet
    }
  })
    .then((transaction) => { return res.status(200)
        .json({ message: 'Updated successfully!',
        data: transaction
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

const transactionDelete = (req, res) => {
  const transactionId = req.param.id;
  if (!transactionId) {
    return res.status(404).json({ message: 'transaction not found!' });
  }
  Transaction.findByIdAndRemove(transactionId)
    .then(() => { return res.status(200)
        .json({ message: 'successfully deleted the transaction' });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  transactionList,
  transactionReadOne,
  transactionCreate,
  transactionUpdate,
  transactionDelete
};
