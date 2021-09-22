import { Config } from './config';
import Web3 from 'web3';
import { signDaiPermit } from 'eth-permit';
import { NotificationContainer, NotificationManager } from 'react-notifications';
// import RelayProvider from '@opengsn/provider';
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

// web3.utils.toBN(0)


//  TODO:
//  implement BlockchainManager nto existing Smart Contract interaction
//  CI usage: npm run dev
      
  //  

export class BlockchainManager {
  CONSTANTS = {
    'emptyPlatform': "0x0000000000000000000000000000000000000000000000000000000000000000",
    'emptyData': "0x0",
  };

  TRANSACTIONS = Object.freeze({
    "updateValue": 1
  })

  config = new Config();

  isInitted;

  provider;
  account;

  web3;
  testSC;
  
  async init(_provider) {
    console.log("BlockchainManager - init");

    if (!_provider) {
      showErrorMessage("_provider == null");
      return;
    }

    const configuration = { 
      paymasterAddress: "0xDd78eF5faE242407467e6aF0331a740B6a24D0BF",
      loggerConfiguration: {
        logLevel: 'debug',
        // loggerUrl: 'logger.opengsn.org',
      }
    }

    //  error occurs
    // this.provider = await RelayProvider.newProvider({ provider: _provider, configuration }).init();

    //  another error occurs, but tries to send tx
    this.provider = RelayProvider.newProvider({ provider: _provider, config: configuration });
    await this.provider.init();

    this.web3 = new Web3(this.provider);
    this.testSC = new this.web3.eth.Contract(this.config.testSC.abi, this.config.testSC.address);

    this.account = (await this.web3.eth.getAccounts())[0];
    
    this.isInitted = true;

    console.log("BlockchainManager - init DONE");
  }

  deinit() {
    console.log("BlockchainManager - deinit");
  }


  async estimateGas(_txType, _params) {
    const txObject = {
      from: this.account,
      to: this.testSC._address,
      value: _params._value ? _params._value : 0,
      data: this._createTxObject(_txType, _params, false).encodeABI()
    }

    return await this.web3.eth.estimateGas(txObject)
  }
  
  sendTx(_txType, _params) {
    if (!this.isInitted) {
      console.error("BlockchainManager - not initted");
      showErrorMessage("BlockchainManager - not initted");
      return;
    }

    try {
      return this._createTxObject(_txType, _params, true);
    } catch (error) {
      console.error(error);
    }
  }

  _createTxObject(_txType, _params, _isSendTx) {
    switch (_txType) {
      case this.TRANSACTIONS.updateValue:
        return this._createTxObjectUpdateValue(_params, _isSendTx);
    
      default:
        throw 'Wrong _txType';
    }
  }

  _createTxObjectUpdateValue(_params, _isSendTx) {
    console.log("     ----  ", this.testSC);
    console.log("     ----  ", this.account);

    if (!_isSendTx) {
      //  --> this WORKS and returns gas amount <-- 
      return this.testSC.methods.updateValueVVV(_params.valueToUpdate);
    }
    
    return this.testSC.methods.updateValueVVV(_params.valueToUpdate).send({
      from: this.account
    });
  }

  accountsChanged(_acc) {
    console.log("BlockchainManager - accountsChanged: ", _acc);
    
    if (this.isInitted) {
      (_acc.length > 0) ? this.account = _acc : delete this.account;
    }
  }
}

export default BlockchainManager;