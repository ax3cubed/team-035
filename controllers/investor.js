const Investor = require('../models/Investor');

const investorList = (req, res) => {
  Investor.find()
    .populate('user')
    .exec()
    .then((investors) => {
      if (!investors) {
        return res.status(404).json({ message: 'investors not found!' });
      }
      return res.status(200).json({ data: investors });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const investorReadOne = (req, res) => {
  const investorid = req.param.id;
  Investor.findById(investorid)
    .populate('user')
    .exec()
    .then((investor) => {
      if (!investor) { return res.status(404).json({ message: 'investor not found!' }); }
      return res.status(200).json({ data: investor });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const investorCreate = (req, res) => {
  Investor.create({
    /* eslint no-underscore-dangle: 0 */
    // userID: user._id,
    preference: req.body.investmentPreference,
    account: req.body.investmentAccountType,
    screen: req.body.screen
  })
    .then((investor) => res.status(201).json({ data: investor }))
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const investorUpdate = (req, res) => {
  const investorid = req.param.id;
  if (!investorid) {
    return res.status(404).json({ message: 'investor not found!' });
  }
  return Investor.findByIdAndUpdate({
    investorid,
    $set: {
      preference: req.body.investmentPreference,
      account: req.body.investmentAccountType,
      screen: req.body.screen
    }
  })
    .then((investor) => res.status(200)
      .json({ data: investor }))
    .catch((err) => res.status(500).json({ error: err }));
};

const investorDelete = (req, res) => {
  const investorid = req.param.id;
  if (!investorid) {
    return res.status(404).json({ message: 'investor not found!' });
  }
  return Investor.findByIdAndRemove(investorid)
    .then(() => res.status(200).json({ message: 'successfully deleted the investor' }))
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  investorList,
  investorReadOne,
  investorCreate,
  investorUpdate,
  investorDelete
};
