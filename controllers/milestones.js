const Milestone = require('../models/milestones');

const milestoneList = (req, res) => {
  Milestone.find()
    .populate('businessID')
    .exec()
    .then((milestones) => {
      if (!milestones) {
        return res.status(404).json({ message: 'milestones not found!' });
      }
      return res.status(200).json({ data: milestones });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
const milestoneReadOne = (req, res) => {
  const milestoneId = req.param.id;
  Milestone.findById(milestoneId)
    .populate('businessID')
    .exec()
    .then((milestone) => {
      if (!milestone) {
        return res.status(404).json({ message: 'milestone not found!' });
      }
      return res.status(200).json({ milestone });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
const milestoneCreate = (req, res) => {
  Milestone.create({
    // businessid: businessID._id,
    milestone: req.body.milestone,
    description: req.body.description,
    expectedTime: req.body.expectedTimeline,
    milestoneAmount: req.body.milestoneAmount
  })
    .then((invest) => res.status(201).json({ data: invest }))
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const milestoneUpdate = (req, res) => {
  const milestoneid = req.param.id;
  if (!milestoneid) {
    return res.status(404).json({ message: 'milestone not found!' });
  }
  return Milestone.findByIdAndUpdate({
    milestoneid,
    $set: {
      milestone: req.body.milestone,
      description: req.body.description,
      expectedTime: req.body.expectedTimeline,
      milestoneAmount: req.body.milestoneAmount
    }
  })
    .then((milestone) => res.status(200).json({ message: 'Updated successfully!', data: milestone }))
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};
const milestoneDelete = (req, res) => {
  const milestoneId = req.param.id;
  if (!milestoneId) {
    return res.status(404).json({ message: 'milestone not found!' });
  }
  return Milestone.findByIdAndRemove(milestoneId)
    .then(() => res.status(200).json({ message: 'successfully deleted the auditTrail' }))
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  milestoneList,
  milestoneCreate,
  milestoneReadOne,
  milestoneUpdate,
  milestoneDelete
};
