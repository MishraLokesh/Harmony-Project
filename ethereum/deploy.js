require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('./build/Factory.json');

const abi = compiledFactory.abi;
const bytecode = compiledFactory.evm.bytecode.object;

// console.log(process.env.MNEMONIC);

let provider = new HDWalletProvider({
  mnemonic: {
    phrase: process.env.MNEMONIC,
  },
  providerOrUrl: process.env.PROVIDER_URL,
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
     .deploy({
       data: '0x' + bytecode,
       arguments: ["NFToken", "NFT"]
      }) 
     .send({from: accounts[0]});

     console.log("contract successfully deployed to address: ", results.options.address);
  }
  catch(error) {
    console.error('error: ', error);
  }
};
deploy();

 
