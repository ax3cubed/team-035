const { compileContract } = require('../lib/compileContract');
const { deployContract } = require('../lib/deployContract');

const compile = (req, res, next) => {
  if (req.body && req.body.contractName) {
    const { contractName } = req.body;
    compileContract(contractName);
    // console.log('Successfully compiled the contract using Express.js Middleware');
    next();
  } else {
    res.status(401).json({
      message: 'Error: No Contract Name provided'
    });
    // console.error('Error: No Contract Name provided: ', error);
  }
};

const deploy = (req, res, next) => {
  const { contractName } = req.body;
  const contractAddress = deployContract(contractName);
  res.contractAddress = contractAddress;
  // console.log('Successfully deployed the contract using Express.js Middleware');
  next();
};

const getContractAddress = (req, res) => {
  const { contractAddress } = res;
  // Return contract address in response object
  res.json({
    contractAddress
  });
};

module.exports = {
  compile,
  deploy,
  getContractAddress
};
