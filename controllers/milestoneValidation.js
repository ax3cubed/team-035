const MilestoneValidation = require('../models/milestoneValidation');

const milestoneValidationList = (req, res) => {
  MilestoneValidation.find()
    .populate('validator')
    .populate('milestoneReport')
    .exec()
    .then((milestoneValidations) => {
      if (!milestoneValidations) {
        return res.status(404).json({ message: 'milestoneValidations not found!' });
      }
      return res.status(200).json(milestoneValidations);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const milestoneReadOne = (req, res) => {
  const milestoneValidationId = req.param.id;
  MilestoneValidation.findById(milestoneValidationId)
    .populate('validator')
    .populate('milestoneReport')
    .exec()
    .then((milestoneValidation) => {
      if (milestoneValidation) {
        return res.status(404).json({ message: 'milestoneValidation not found!' });
      }
      return res.status(200).json({ data: milestoneValidation });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const milestoneValidationCreate = (req, res) => {
  MilestoneValidation.create({
    // userid: validator._id,
    // milestonereportid: milestoneReport._id,
    remark: req.body.remark,
    verdict: req.body.verdict
  })
    .then((validation) => res.status(201).json({ data: validation }))
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const milestoneValidationUpdate = (req, res) => {
  const milestoneValidationid = req.param.id;
  if (!milestoneValidationid) {
    return res.status(404).json({ message: 'milestoneValidation not found!' });
  }
  return MilestoneValidation.findByIdAndUpdate({
    milestoneValidationid,
    $set: {
      remark: req.body.remark,
      verdict: req.body.verdict
    }
  })
    .then((milestoneValidation) => res.status(200).json({
      message: 'Updated successfully!',
      data: milestoneValidation
    }))
    .catch((err) => res.status(400).json({ error: err }));
};

const milestoneValidationDelete = (req, res) => {
  const milestoneValidationId = req.param.id;
  if (!milestoneValidationId) {
    return res.status(404).json({ message: 'milestoneValidation not found!' });
  }
  return MilestoneValidation.findByIdAndRemove(milestoneValidationId)
    .then(() => res
      .status(200)
      .json({ message: 'successfully deleted the milestoneValidation' }))
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

module.exports = {
  milestoneValidationList,
  milestoneReadOne,
  milestoneValidationCreate,
  milestoneValidationUpdate,
  milestoneValidationDelete
};
