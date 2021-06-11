const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface,bytecode}=require('./compile');


const provider = new HDWalletProvider(
    'skin bike marble smoke claim day need nut width obvious magnet feel',
    'https://rinkeby.infura.io/v3/0ac6b8409aa34a99870301dbb4bef246');

const web3 = new Web3(provider);

// This function exists simply so we can  use async/await syntax
const deploy = async() => {
    const accounts = await web3.eth.getAccounts();
  
    const selectedAccount = accounts[0];
  
    console.log('Attempting to deploy from account', selectedAccount);
  
  
    const result = await
      new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode })
      // Send creates a transaction. Contrast with call
      .send({ gas: '1000000', from: selectedAccount });

    console.log(interface);
    console.log('Contract deployed to', result.options.address);
  };
  deploy();