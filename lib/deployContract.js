/* eslint-disable prefer-template */
/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-buffer-constructor */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const Web3 = require('web3');
const util = require('ethereumjs-util');
const tx = require('ethereumjs-tx');
const lightwallet = require('eth-lightwallet');
const artifactor = require('truffle-artifactor');

const { txutils } = lightwallet;

const deployContract = (contractName) => {
  // FIXME - Convert to Singleton
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

  console.log(`Connected to Web3 Status: ${web3.isConnected()}`);

  /**
   *  IMPORTANT: Obtain an Ethereum address and private key that was created and shown
   *  in the Ganache CLI (TestRPC) Terminal window
   */
  const accountAddress = '0xf1Da159b0408589a5b57b0A7515876FDF22aCE9D';
  const accountPrivateKey = '0xaad7f1104260e4034ecafd88f059c07990796edeab7942504f9a99ba204669d5';

  /**
   *  Compile the Smart Contracts with `truffle compile --compile-all`.
   *  Solidity Contracts .sol are compiled into .json files in the
   *  build/contracts directory.
   */

  /**
   *  Obtain the Bytecode (used for execution in the EVM) and the
   *  ABI (provides mapping for JS to interact with Solidity)
   */

  // // When compiled using `truffle compile...`
  // var smeih = require("../build/contracts/smeih.json");
  // var contractBytecode = smeih.bytecode;
  // var contractABI = smeih.abi;

  // When compiled using compileContract.js
  const smeih = require(`../build/contracts/${contractName}.sol.js`);
  smeih.setProvider(web3);
  const contractBytecode = smeih.all_networks.default.unlinked_binary;
  const contractABI = smeih.all_networks.default.abi;
  const contractAddress = smeih.deployed().contract.address;

  // Do not supply more gas than the block gas limit else error: Exceeds block gas limit
  console.log('Current Block Gas Limit: ', web3.eth.getBlock('latest'));

  /**
   *  Function to sign transaction with the private key of our Ethereum address
   *  and send the transaction to the Ethereum TestRPC (Ganache CLI) network
   */
  function sendRaw(rawTx) {
    const privateKey = new Buffer(accountPrivateKey, 'hex');
    const transaction = new Tx(rawTx);
    transaction.sign(privateKey);
    const serializedTx = transaction.serialize().toString('hex');
    // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendrawtransaction
    web3.eth.sendRawTransaction(
      `0x${serializedTx}`, (err, hash) => {
        if (err) {
          console.log('sendRawTransaction error: ', err);
        } else {
          console.log('sendRawTransaction transaction address: ', hash);
          // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgettransactionreceipt
          web3.eth.getTransactionReceipt(hash, (err, receipt) => {
            if (err) {
              console.log('getTransactionReceipt error: ', err);
            } else {
              console.log('getTransactionReceipt transaction receipt: ', receipt);
              console.log('getTransactionReceipt transaction address: ', receipt.contractAddress);
            }
          });
        }
      }
    );
  }

  /**
   *  Deploy the Smart Contract by constructing the following transaction
   *    - nonce - sequential integer to track number of outgoing transactions
   *    - gasLimit - max gas to pay for the transaction
   *    - gasPrice - price willing to pay for gas used in the transaction
   *      (i.e. transaction fee in Ether == gasPrice * gas used)
   *    - data - instructions for the transaction, which includes:
   *       - bytecode - to instruct the creation of the Ballot smart contract
   *       - argument - the argument to the Ballot function in the smart contract
   *         is zero padded (i.e. where a value of 5 is the argument _numProposals)
   */
  const rawTx = {
    nonce: web3.toHex(web3.eth.getTransactionCount(accountAddress)),
    gasLimit: web3.toHex(200000),
    gasPrice: web3.toHex(700000), // 70 GWei
    data: '0x' + contractBytecode + '0000000000000000000000000000000000000000000000000000000000000005'
  };

  /**
   *  Estimate the cost of sending the transaction to a random address
   */
  const gasEstimate = web3.eth.estimateGas({
    to: '0x2b5ad5c4795c026514f8317c7a215e218dccd6cf',
    data: rawTx.data
  });
  console.log(gasEstimate);

  // FIXME - When try to deploy contract by calling `sendRaw` instead of migrating
  // the contract using Truffle with `truffle migrate --reset --network development`
  // it always results in these errors, where default sender balance: 6666756738730000000000,
  // even though the gasEstimate returns only 316120
  //   - Error: VM Exception while processing transaction: out of gas
  //   - Error: base fee exceeds gas limit

  /**
   *  Send the transaction to the Ethereum TestRPC (Ganache CLI)
   */
  // sendRaw(rawTx);

  /**
   *  Deploy the contract with Truffle Migrate `truffle migrate --reset --network development`
   *  then obtain Contract Address with:
   */
  // contractAddress = '0xf422e821237328257e9ae78d30a6081753cd67be';
  const smeihContractABI = web3.eth.contract(contractABI);
  const smeihContractInstance = smeihContractABI.at(contractAddress);

  // Assign default account
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log(web3.eth.coinbase);
  console.log(web3.eth.defaultAccount);

  // Filter pending
  const filter = web3.eth.filter('pending');
  filter.watch((err, result) => {
    console.log('Event log watched: ', result);
  });
  filter.stopWatching();

  // All Events
  const allEvents = smeihContractInstance.allEvents({ fromBlock: 0, toBlock: 'latest' });
  allEvents.watch((error, event) => {
    if (!error) console.log(event);
  });
  allEvents.stopWatching();

  // Filter
  // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter
  web3.eth.filter({
    address: contractAddress,
    fromBlock: 0,
    toBlock: 'latest',
    topics: [web3.sha3('SkillEvent(address,bytes32,uint)')]
    // topics: [web3.sha3('newtest(string,uint256,string,string,uint256)')]
  }).get((err, result) => {
    console.log('Event log filtered: ', result);
  });

  // Call event in smeih Smart Contract
  // http://solidity.readthedocs.io/en/develop/contracts.html#events
  const event = smeihContractInstance.skill.sendTransaction('3d printing',
    { fromBlock: 0, toBlock: 'latest' },
    (error, result) => {
      if (!error) {
        console.log('Event log from contract: ', result);
      } else {
        console.log('Error logging: ', error);
      }
    });

  return contractAddress;
};

run = (contractName) => {
  deployContract(contractName);
};

// Process Routes for API
module.exports = {
  deployContract
};

// Process CLI (i.e. `node lib/deployContract.js smeih`)
if (require.main === module) {
  if (process.argv.length < 3) {
    console.log('Error: Contract Name as argument is required');
    process.exit(1);
  }
  const contractName = process.argv[2];
  run(contractName);
}
