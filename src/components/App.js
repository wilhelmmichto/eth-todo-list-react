import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";


class App extends Component {
  async UNSAFE_componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum beowser detected! Check out Metamask!");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const network = await web3.eth.net.getNetworkType();
    console.log(accounts);
    console.log(network);
  }

  constructor(props){
    super(props)
    this.state = {account: ''}
  }

  render() {
    return <div>
      <h1>hello world</h1>
      <p>Your Account: {this.state.account} </p>
    </div>;
  }
}

export default App;
