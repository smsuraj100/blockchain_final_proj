import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      buffer: null,
      ipfsHash: "",
      url: "",
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // const { ethereum } = window;

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    try {
      const response = await contract.methods.get().call({ from: accounts[0] });

      // Update state with the result.
      this.setState({ ipfsHash: response });
    } catch (error) {
      console.log(error);
      return;
    }
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { accounts, contract } = this.state;
    console.log("On SUbmit");
    try {
      // ipfs.
      const result = await ipfs.add(Buffer.from(this.state.buffer));

      await contract.methods.set(result.path).send({ from: accounts[0] });
      // this.setState((prev) => [...prev, url]);
      const ipfsHash1 = await contract.methods
        .get()
        .call({ from: accounts[0] });
      const url = `https://ipfs.infura.io/ipfs/${ipfsHash1}`;
      this.setState({ url: url });
      this.setState({ ipfsHash: ipfsHash1 });
      console.log("ipfsHash-->", this.state.ipfsHash);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  onFileChange(e) {
    console.log("On file changee");
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("Buffer-->", this.state.buffer);
    };
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Digital Document Storage System</h1>
        <label>
          Your documents will be stored in Ethereum blockchain using IPFS APIs.
        </label>
        {this.state.ipfsHash && (
          <img
            src={`https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`}
            alt="alt"
          />
        )}
        <h2>Upload Document:</h2>
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.onFileChange} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
