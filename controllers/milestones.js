const AuditTrail = require("../models/auditTrail");

const milestoneList = (req, res) => {
  Milestone.find()
    .populate("businessID")
    .exec()
    .then((milestones) => {
      if (milestones) {
        return res.status(200).json(milestones);
      } else {
        return res.status(404).json({ message: "milestones not found!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

const milestoneReadOne = (req, res) => {
  const milestoneId = req.param.id;
  milestone
    .findById(milestoneId)
    .populate("businessID")
    .exec()
    .then((milestone) => {
      if (milestone) {
        res.status(200).json({
          milestone,
        });
      } else {
        return res.status(404).json({ message: "milestone not found! " });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
