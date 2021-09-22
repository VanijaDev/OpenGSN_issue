import React, { useState, useEffect } from "react";
import './App.css';
import Web3 from 'web3'
import {Biconomy} from "@biconomy/mexa";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { signDaiPermit } from 'eth-permit';

import WalletConnectProvider from "@walletconnect/web3-provider";
import CustomQRCodeModal from "@walletconnect/web3-provider"


const { config } = require("./config");

// const provider = new WalletConnectProvider({
//   infuraId: "6ecc6b3d57b44ff7b743a2775e69a78b",
// });

const provider = new WalletConnectProvider({
  infuraId: "6ecc6b3d57b44ff7b743a2775e69a78b",
  qrcodeModalOptions: {
    mobileLinks: [
      "rainbow",
      "metamask",
      "argent",
      "trust",
      "imtoken",
      "pillar",
    ],
  },
});


// Subscribe to accounts change
provider.on("accountsChanged", (accounts) => {
  console.log("accountsChanged: ", accounts);
});

// Subscribe to chainId change
provider.on("chainChanged", (chainId) => {
  console.log("chainChanged: ", chainId);
});

// Subscribe to session disconnection
provider.on("disconnect", (code, reason) => {
  console.log("disconnect: ", code, reason);
});
const web3 = new Web3(provider);


function App() {

  useEffect(() => {
    startApp();
  }
  , []);

  async function startApp() {
    console.log("---  startApp  ---");

  }

  

  //  ------------------------------------------------------------

  async function onNewSession() {
    console.log("onNewSession");

    if (provider.connected) {
      console.log("--- Session connected, disconnect it");
      provider.disconnect();
    } else {
      console.log("--- New session");
      //  Enable session (triggers QR Code modal)
      await provider.enable();
    }

    console.log("provider: ", provider);
  }

  async function onSign() {
    console.log("onSign");


  }
  

  return (
    <div className="App">
      *Use this DApp only on Kovan Network
      <header className="App-header">
        <h1>Tournament DAO</h1>
        <section>

          <div className="submit-container">
            <button type="button" className="button" onClick={onNewSession}>New Session</button>
          </div>

          <div className="submit-container">
            <button type="button" className="button" onClick={onSign}>Sign</button>
          </div>

        </section>
      </header>
      <NotificationContainer />
    </div >
  );
}

export default App;