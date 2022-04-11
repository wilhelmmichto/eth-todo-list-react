import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import TodoList from '../truffle_abis/TodoList.json'

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
    const networkId = await web3.eth.net.getId();
   
    //Load TODO Contract
    const todoData = TodoList.networks[networkId];
    if (todoData) {
      const todoList = new web3.eth.Contract(TodoList.abi, todoData.address);
      this.setState({ todoList });
      let taskCount = await todoList.methods.taskCount().call()
      this.setState({taskCount})
      console.log(taskCount);
      for (var i = 1; i <= taskCount; i++) {
        const task = await todoList.methods.tasks(i).call()
        this.setState({
          tasks: [...this.state.tasks, task]
        })
      }
    } else {
      window.alert("Todo List not deployed to the network");
    }
    
  }



  constructor(props) {
    super(props);
    this.state = {
      account: "",
      taskCount: 0,
      tasks:[],
      
    }

    
  };




  

  

  render() {
    return (
      <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.dappuniversity.com/free-download" target="_blank">Dapp University | Todo List</a>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small><a className="nav-link" href="#"><span id="account"></span></a></small>
        </li>
      </ul>
    </nav>
    <div className="container-fluid">
      <div className="row">
        <main role="main" className="col-lg-12 d-flex justify-content-center">
          <div id="loader" className="text-center">
            <p className="text-center">Loading...</p>
          </div>
          <div id="content">
            <form onSubmit="App.createTask(); return false;">
              <input id="newTask" type="text" className="form-control" placeholder="Add task..." required/>
              <input type="submit" hidden=""/>
            </form>
            <ul id="taskList" className="list-unstyled">
              {this.state.tasks.map((task,key)=>{
                return(
                <div className="taskTemplate checkbox" key={key} >
                <label>
                  <input type="checkbox" />
                  <span className="content">{task.content}</span>
                </label>
              </div>
              )
              })}
              
            </ul>
            <ul id="completedTaskList" className="list-unstyled">
            </ul>
          </div>
        </main>
      </div>
    </div>
  </div>
    );
  };
}

export default App;
