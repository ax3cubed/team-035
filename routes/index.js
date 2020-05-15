const router = require('express').Router();

const auth = require('../middleware/auth');
const ctrlUser = require('../controllers/user');
const ctrlInvestee = require('../controllers/investee');
const ctrlInvestor = require('../controllers/investor');
const ctrlAuditTrail = require('../controllers/auditTrail');
const ctrlBusiness = require('../controllers/business');
const ctrlMilestone = require('../controllers/milestones');
const ctrlMilestoneReport = require('../controllers/milestonesReport');
const ctrlMilestoneValidation = require('../controllers/milestoneValidation');
const ctrlTransaction = require('../controllers/transaction');
const ctrlSetting = require('../controllers/setting');

router
  .route('invest')
  .get(ctrlInvestee.investList)
  .post(ctrlInvestee.investeeCreate);

router
  .route('/invest/:investid')
  .get(ctrlInvestee.investReadOne)
  .put(ctrlInvestee.investeeUpdate)
  .delete(ctrlInvestee.investDelete);

router
  .route('investor')
  .get(ctrlInvestor.investorList)
  .post(ctrlInvestor.investorCreate);

router
  .route('/investor/:investorid')
  .get(ctrlInvestor.investorReadOne)
  .put(ctrlInvestor.investorUpdate)
  .delete(ctrlInvestor.investorDelete);

router
  .route('audit')
  .get(ctrlAuditTrail.auditTrailList)
  .post(ctrlAuditTrail.auditTrailCreate);

router
  .route('audit/:auditid')
  .get(ctrlAuditTrail.auditTrayReadOne)
  .put(ctrlAuditTrail.auditTrailUpdate)
  .delete(ctrlAuditTrail.auditTrailDelete);

router
  .route('business')
  .get(ctrlBusiness.businessList)
  .post(ctrlBusiness.businessCreate);

router
  .route('business/:businessid')
  .get(ctrlBusiness.businessReadOne)
  .put(ctrlBusiness.businessUpdate)
  .delete(ctrlBusiness.businessDelete);

router
  .route('transaction')
  .get(ctrlTransaction.transactionList)
  .post(ctrlTransaction.transactionCreate);

router
  .route('transaction/:transactionid')
  .get(ctrlTransaction.transactionReadOne)
  .put(ctrlTransaction.transactionUpdate)
  .delete(ctrlTransaction.transactionDelete);

router
  .route('milestone')
  .get(ctrlMilestone.milestoneList)
  .post(ctrlMilestone.milestoneCreate);

router
  .route('milestone/:milestoneid')
  .get(ctrlMilestone.milestoneReadOne)
  .put(ctrlMilestone.milestoneUpdate)
  .delete(ctrlMilestone.milestoneDelete);

router
  .route('milestonereport')
  .get(ctrlMilestoneReport.milestoneReportList)
  .post(ctrlMilestoneReport.milestoneReportCreate);

router
  .route('milestonereport/:milestonereportid')
  .get(ctrlMilestoneReport.milestoneReportReadOne)
  .put(ctrlMilestoneReport.milestoneReportUpdate)
  .delete(ctrlMilestoneReport.milestoneReportDelete);

router
  .route('milestonevalidation')
  .get(ctrlMilestoneValidation.milestoneValidationList)
  .post(ctrlMilestoneValidation.milestoneValidationCreate);

router
  .route('milestonevalidation/:milestonevalidationid')
  .get(ctrlMilestoneValidation.milestoneReadOne)
  .put(ctrlMilestoneValidation.milestoneValidationUpdate)
  .delete(ctrlMilestoneValidation.milestoneValidationDelete);

router.route('setting').post(ctrlSetting.settingCreate);

router
  .route('setting/:settingid')
  .put(ctrlSetting.settingUpdate)
  .delete(ctrlSetting.settingDelete);

router.post(
  'auth/register',
  (req, res, next) => {
    auth.register(req, res, next);
  },
  (req, res, next) => {
    auth.signIn();
    next();
  },
  auth.signJWTForUser
);

router.post('auth', auth.signIn, auth.signJWTForUser);

router
  .route('user')
  .get(auth.validateJWTWithPassportJWT, ctrlUser.userList)
  .post(auth.validateJWTWithPassportJWT, ctrlUser.userCreate);

router
  .route('user/:userid')
  .get(ctrlUser.userReadOne)
  .put(ctrlUser.userUpdate)
  .delete(ctrlUser.userDelete);

module.exports = router;
