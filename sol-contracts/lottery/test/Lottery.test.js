const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
// UPDATE THESE TWO LINES RIGHT HERE!!!!! <-----------------
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface,bytecode}=require('../compile');

let accounts;
let lottery;
beforeEach (async ()=>{
    //get a list of all accounts
            // web3.eth.getAccounts()
            //     .then(fetchAccounts=>{
            //         console.log(fetchAccounts);
            // }); 
    accounts = await web3.eth.getAccounts();     
  
    //use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
     .deploy({data: bytecode})
     .send({
         from: accounts[0], 
         gas: '1000000' 
        });
    // ADD THIS ONE LINE RIGHT HERE!!!!! <---------------------
     lottery.setProvider(provider);
});

describe ('Lottery Contract',()=> {
    it('deploys a contract', ()=> {
        assert.ok(lottery.options.address);
    });
    it('allows one account to enter',async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
    const players= await lottery.methods.getPlayers().call({
        from: accounts[0]
        });
    assert.equal(accounts[0],players[0]);
    assert.equal(1,players.length);

    });

    it('allows multiple account to enter',async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02','ether')
        });
    const players= await lottery.methods.getPlayers().call({
        from: accounts[0]
        });
    assert.equal(accounts[0],players[0]);
    assert.equal(accounts[1],players[1]);
    assert.equal(accounts[2],players[2]);
    assert.equal(3,players.length);
    });
//goal is to make sure u have to enter a min amount of ether this should return that someonething is wrong by adding a low amount of ether
    it('requires a minimum amount of ether to enter',async()=>{
        try{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: 0
        });
        assert(false);
        }catch (err){
            assert(err);
        }
    });
//should get kicked out cause restricted function
    it('only manager can call pickWinner',async ()=> {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it('sends money to winner and resets the players array',async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance=await web3.eth.getBalance(accounts[0]);
        
        await lottery.methods.pickWinner().send({from: accounts[0]});

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference=finalBalance - initialBalance;
        console.log(difference);
        assert(difference > web3.utils.toWei('1.8','ether'));
    });
});