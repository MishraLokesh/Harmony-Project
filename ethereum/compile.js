const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const Contractpath = path.resolve(__dirname, 'contracts', 'HealthHub.sol');
const source = fs.readFileSync(Contractpath, 'UTF-8');

var input = {
  language: 'Solidity',
  sources: {
      'HealthHub.sol' : {
          content: source
      }
  },
  settings: {
      outputSelection: {
          '*': {
              '*': [ '*' ]
          }
      }
  }
};



var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output);

fs.ensureDirSync(buildPath);

output = output.contracts['HealthHub.sol'];

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'), 
    output[contract]
  );
}


require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('./build/Factory.json');

// console.log(  process.env.mnemonic, `https://rinkeby.infura.io/v3/${process.env.infura_API}` )

const abi = compiledFactory.abi;
const bytecode = compiledFactory.evm.bytecode.object;

let provider = new HDWalletProvider({
  mnemonic: {
    phrase: 'end inquiry kingdom party glow topic trip rely image man guitar matter',
  },
  // providerOrUrl: `https://rinkeby.infura.io/v3/${process.env.infura_API}`,
  providerOrUrl: 'https://rinkeby.infura.io/v3/600f2be8cdfd4634be1376f1f858d9eb',
  chainId: '4'
});

// console.log(abi);
// console.log(bytecode);

const web3 = new Web3(provider)

const deploy = async () => {
  try {
  const accounts = await web3.eth.getAccounts();
  console.log('Deploying the contract from: ', accounts[0]);
  const results = await new web3.eth.Contract(JSON.parse(JSON.stringify(abi)))
     .deploy({data: '0x' + bytecode}) 
     .send({from: accounts[0]});
  // console.log("abi: ", JSON.stringify(abi));
  console.log("contract successfully deployed to address: ", results.options.address);
  }
  catch(error) {
    console.error('error: ', error);
  }
};
deploy();

 
