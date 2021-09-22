import React, { useState, useEffect } from "react";
import './App.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import BlockchainManager from "./BlockchainManager";
import { Config } from './config';
import WalletConnectProvider from "@walletconnect/web3-provider";




import Web3 from 'web3';
const { RelayProvider } = require('@opengsn/provider');

const showErrorMessage = message => {
  NotificationManager.error(message, "Error", 5000);
};
const showSuccessMessage = message => {
  NotificationManager.success(message, "Message", 3000);
};
const showInfoMessage = message => {
  NotificationManager.info(message, "Info", 3000);
};

const blockchainManager = new BlockchainManager();
const test_config = new Config();


function App() {

  useEffect(() => {
    init();
  }
    , []);
  
  async function init() {
    console.log("index - init");
  }

  //  ------------------------------------------------------------
  async function onConnect() {
    console.log("onConnect");

    if (typeof window.ethereum === 'undefined') {
      showErrorMessage("No ethereum obj");
      return;
    }

    if ((await window.ethereum.request({ method: 'eth_chainId' })) != 42) {
      console.error("Wrong network, must be Kovan");
      showErrorMessage("Wrong network, must be Kovan");
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await blockchainManager.init(window.ethereum);

      document.getElementById("connectedAcc").innerText = blockchainManager.account;

      listenForWalletConnectEvents();
      listenForEthereumEvents();
    } catch (error) {
      console.error(error);
      blockchainManager.deinit();
      document.getElementById("connectedAcc").innerText = "...";
    }
  }

  function listenForWalletConnectEvents() {
    // Subscribe to accounts change
    blockchainManager.provider.on("accountsChanged", (accounts) => {
      console.log(accounts);
    });

    // Subscribe to chainId change
    blockchainManager.provider.on("chainChanged", (chainId) => {
      console.log(chainId);
    });

    // Subscribe to session connection
    blockchainManager.provider.on("connect", () => {
      console.log("connect");
    });

    // Subscribe to session disconnection
    blockchainManager.provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
    });
  }

  function listenForEthereumEvents() {
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log("accountsChanged: ", accounts);
      blockchainManager.accountsChanged(accounts[0]);
      document.getElementById("connectedAcc").innerText = blockchainManager.account;
    });

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });

    window.ethereum.on('connect', (connectInfo) => {
      console.log("connect: ", connectInfo);
    });

    window.ethereum.on('disconnect', (error) => {
      console.log("disconnect: ", error);
    });
  }


  
  async function onUpdateValue() {
    if (document.getElementById("valueInput").value.length == 0) {
      showErrorMessage("Wrong value");
      return;
    }
    
    const PARAMS = {
      valueToUpdate: document.getElementById("valueInput").value,
    }

    if (document.getElementById("estimateGasInput").checked) {
      const gasAmount = await blockchainManager.estimateGas(blockchainManager.TRANSACTIONS.updateValue, PARAMS);
      console.log("gasAmount: ", gasAmount);
      showInfoMessage("estimateGas: " + gasAmount);
    } else {
      const tx = blockchainManager.sendTx(blockchainManager.TRANSACTIONS.updateValue, PARAMS);
      tx.on("transactionHash", function (hash) {
        console.log(` Transaction hash is ${hash}`);
        console.log(`   Transaction sent. Waiting for confirmation ..`);
      }).once("confirmation", async function (confirmationNumber, receipt) {
        console.log(receipt);
        console.log(receipt.transactionHash);
        showSuccessMessage("TX success");
      }).once("error", function (err) {
        console.error("err: ", err);
        showErrorMessage((err.code == 4001) ? "Rejected by User" : "TX failed");
      });
    }
  }

  return (
    <div className="App">
      *Use this DApp only on Kovan Network
      <header className="App-header">
        <h1>Test OpenGSN</h1>
        <button id="connectBtn" type="button" className="button" onClick={onConnect}>Connect</button>
        <span id="connectedAcc">...</span>
        <section>
          <div className="submit-container">
            <div className="submit-row" style={{margin: '10px 0'}}>
              <button type="button" className="button" onClick={onUpdateValue}>Update value</button>
              <input id="valueInput" placeholder="uint value"></input>
              <div><span>EstimateGas</span><input id="estimateGasInput" type="checkbox" style={{ width: '20px', height: '20px' }}></input></div>
            </div>
          </div>
        </section>
      </header>
      <NotificationContainer />
    </div >
  );
}

export default App;