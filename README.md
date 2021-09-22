# OpenGSM integration error

## General
- Blockchain: Kovan
- Please see attached screenshot with errors.
- Test Smart Contracts can be found in `blockchain` folder. I had to create local versions because I need the latest solidity version, 0.8.7.

## Smart Contracts flow:
- deployed `MyPaymasterAcceptFromAll` Smart Contract
- `setRelayHub` with "0x727862794bdaa3b8Bc4E3705950D4e9397E3bAfd" address for Kovan (https://docs.opengsn.org/contracts/addresses.html#ethereum)
- `deposit` 0.4 ETH in `MyPaymasterAcceptFromAll` Smart Contract -> balanceOf in `RelayHub` is correct
- deployed `MyForwarder` Smart Contract
- deployed `TestSC` with `MyForwarder` address

## Setup
- `npm i` in `blockchain` folder
- `npm i` in `web` folder
- `npm start` to start local app
 
## Web
- set correct ABI and address for TestSC in `web -> config.js`
- set correct `paymasterAddress` in `BlockchainManager`

## Test
- click `Connect` button on web page to init BlockchainManager
- enable EstimateGas chackbox to estimate gas of the transaction. This works, so ABI & address of `TestSC` is correct
- set any number in text field
- click button `Update value` to send transaction -> erorr in console