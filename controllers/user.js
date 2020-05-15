/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-trailing-whitespace */
const User = require('../models/User');

const userList = (req, res) => {
  User.find()
    .exec()
    .then((users) => {
      if (!users) {
        return res.status(404).json({ message: 'users not found!' });
      } 
      return res.status(200).json({ data: users });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const userReadOne = (req, res) => {
  const userId = req.param.id;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'user not found!' });
      } 
      return res.status(200).json({ data: user });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const userCreate = (req, res) => {
  User.create({
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    phone: req.body.phoneNumber,
    account: req.body.accountType,
    password: req.body.password
  })
    .then((user) => { return res.status(201)
        .json({ data: user }); })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const userUpdate = (req, res) => {
  const userid = req.param.id;
  if (!userid) {
    return res.status(404).json({ message: 'user not found!' });
  }
  User
    .findByIdAndUpdate({
      userid,
      $set: {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        phone: req.body.phoneNumber,
        account: req.body.accountType,
        password: req.body.password
      }
    })
    .then((user) => { return res.status(200)
        .json({ message: 'Updated successfully!',
        data: user
      });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

const userDelete = (req, res) => {
  const userId = req.param.id;
  if (!userId) {
    return res.status(404).json({ message: 'user not found!' });
  }
  User
    .findByIdAndRemove(userId)
    .then(() => {
      return res.status(200).json({ message: 'successfully deleted the user' });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  userList,
  userReadOne,
  userCreate,
  userUpdate,
  userDelete
};
