/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const solc = require('solc');
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const Pudding = require('ether-pudding');

const compileContract = (contractName) => {
  const source = fs.readFileSync(
    `${path.join(__dirname, '../contracts')}/${contractName}.sol`, { encoding: 'utf8' }
  ).toString();
  // console.log(source);
  const input = {
    language: 'Solidity',
    sources: {
      [contractName]: {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
  // console.log(compiled.contracts[`${contractName}`][`${contractName}`]);
  // console.log(Object.keys(compiled));
  // fs.writeFile(path.join(__dirname, './hey.json'), JSON.stringify(compiled.contracts[`${contractName}`][`${contractName}`].evm.bytecode), { encoding: 'utf8' }, (err) => {
  //   if (err) throw err;
  //   console.log(err);
  // });
  if (!compiled.contracts[`${contractName}`]) {
    // console.log('Contract must have same name as file!');
    process.exit(1);
  }
  const { bytecode } = compiled.contracts[`${contractName}`][`${contractName}`].evm;
  const interfaces = compiled.contracts[`${contractName}`][`${contractName}`].abi;

  const contractData = {
    abi: interfaces,
    unlinked_binary: bytecode.object,
    address: '0xf1Da159b0408589a5b57b0A7515876FDF22aCE9D'
  };

  const expectedFilepath = `${path.join(__dirname, '../build/contracts')}/${contractName}.sol.js`;
  console.log(contractData);
  Pudding.save(contractName, contractData, expectedFilepath)
    .then(() => {
      console.log(`${'File api/build/contracts/'}${contractName}.sol.js was created with the JS contract!`);
    })
    .catch((err) => {
      console.log('Error saving contract', err);
    });
};

// eslint-disable-next-line no-undef
run = (contractName) => {
  compileContract(contractName);
};

// Process Routes for API
module.exports = {
  compileContract
};

// Process CLI (i.e. `node lib/compileContract.js smeih`)
// Reference: http://coding.pstodulka.com/2014/10/22/node-modules-as-cli/
if (require.main === module) {
  if (process.argv.length < 3) {
    console.log('Error: Contract Name as argument is required');
    process.exit(1);
  }
  const contractName = process.argv[2];
  // eslint-disable-next-line no-undef
  run(contractName);
}
