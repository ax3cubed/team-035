const Investee = require('../models/investee');

const investList = (req, res,) => {
  Investee.find()
    .populate('user')
    .exec()
    .then((investees) => {
      if (!investees) {
        return res.status(404).json({ message: 'Investees not found!' });  
      } 
      return res.status(200).json(investees);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const investReadOne = (req, res) => {
  const investid = req.param.id;
  Investee.findById(investid)
    .populate('user')
    .exec()
    .then((investee) => {
      if (!investee) {
        return res.status(404).json({ message: 'Investee not found! ' });
      } 
      return res.status(200).json({ data: investee });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const investeeCreate = (req, res) => {
  Investee.create({
    user: user._id,
    company: req.body.companyName,
    address: req.body.Adress
  })
    .then((invest) => { return res.status(201).json(invest); })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const investeeUpdate = (req, res) => {
  const investid = req.param.id;
  if (!investid) {
    return res.status(404).json({ message: 'Investee not found!' });
  }
  Investee.findByIdAndUpdate({
    investid,
    $set: {
      phone: req.body.mobilePhone,
      company: req.body.companyName,
      address: req.body.Adress,
    },
  })
    .then((invest) => { return res.status(200).json({ invest });
    })
    .catch((err) => res.status(500).json({ error: err }) );
};

const investDelete = (req, res) => {
  const investid = req.param.id;
  if (!investid) {
    return res.status(404).json({ message: 'Investee not found!' });
  }
  Investee.findByIdAndRemove(investid)
    .then(() => {
      return res.status(200).json({ message: 'successfully deleted the investee' });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  investList,
  investReadOne,
  investeeCreate,
  investeeUpdate,
  investDelete
};