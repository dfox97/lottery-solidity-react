import './App.css';
import web3 from './web3';
import React, {useState, useEffect } from 'react';
import lottery from './lottery';


function App () {
    const [manager, setManager]=useState('');
    const [value, setValue]=useState('');
    const [players, setPlayers]=useState([]);
    const [balance, setBalance]=useState('');
    const [message, setMessage]=useState('');
                        
    const onSubmit= async (event)=> {
        event.preventDefault();
        const accounts = await web3.eth.requestAccounts();
        setMessage('Waiting on transaction...');
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(value, 'ether')
        });
        setMessage("You have been entered!");

    };
    const onClick = async ()=> {
        const accounts = await web3.eth.requestAccounts();
        setMessage('Hold on! Waiting on transaction success...');
        await lottery.methods.pickWinner().send({
            from: accounts[0],
        });
        setMessage("A winner has been picked! Check your account to see if you have Won!");

    };
 
    useEffect(()=>{
        const fetchData = async ()=> {
            const manager = await lottery.methods.manager().call();
            const players = await lottery.methods.getPlayers().call();
            const balance = await web3.eth.getBalance(lottery.options.address);

            setManager(manager);
            setPlayers(players);
            setBalance(balance);
        }
        fetchData();
    },[]);

    return (
        <div className="Lottery-manager">
            <h2>Lottery Contract</h2>
            <p>This contract is managed by {manager}, there are currently 
            {players} entered, the balance is : {web3.utils.fromWei(balance,'ether')} ether</p>
            <hr/>

            <form onSubmit={onSubmit}>
               <h4>Want to try your luck ?</h4>
               <div>
                    <label>Amount of ether to enter</label>
                    <input
                   
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    />   
                </div> 
                <button>Enter</button>
            </form>
            <hr />
            <h4>Ready to pick a winner?</h4>
            <button onClick={onClick}>Pick a Winner!</button>
            <hr />
            
            <h1>{message}</h1>

        </div>
    )

};


export default App;
