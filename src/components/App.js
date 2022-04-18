import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import TodoList from '../truffle_abis/TodoList.json'
import TodoLists from "./TodoLists";
import ClipLoader from "react-spinners/ClipLoader";

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
    this.setState({loading: false})

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
      this.setState({loading: false})
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
      loading: true
    }
    this.createTask = this.createTask.bind(this)
    this.toggleCompleted = this.toggleCompleted.bind(this)

  };

  createTask(content) {
    this.setState({ loading: true })
    this.state.todoList.methods.createTask(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  toggleCompleted(taskId) {
    this.setState({ loading: true })
    this.state.todoList.methods.toggleCompleted(taskId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

 





  render() {
    return (
      <div className="app">
        <nav
          className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow  "
          style={{ color: "yellow", height: "50px" }}
        >
          <div  style={{ marginLeft: "15px", fontSize: "20px" }}>
            Todo List DAPP
          </div>
          <div style={{ marginRight: "15px", fontSize: "13px" }}>
          &nbsp;&nbsp;{this.state.account}
          </div>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main
              role="main"
              className="main col-lg-12 d-flex justify-content-center"
            >
              {this.state.loading ? (
                <div id="loader" className="text-center " >
                  <p className="text-center">Loading </p>
                  <ClipLoader  color={'black'}  size={20} />

                </div>
              ) : (
                <TodoLists
                  tasks={this.state.tasks}
                  createTask={this.createTask}
                  toggleCompleted={this.toggleCompleted}
                />
              )}
            </main>
          </div>
          <div
            className="col-lg-12 d-flex justify-content-center "
            style={{
              marginTop: "50px",
              display: "flex",
              alignItems: "center",
              fontSize:'20px',
              textAlign:'center',
              flexDirection:'column'
            }}
          >
            <button style={{ borderRadius: "5px", border: "solid 1px",display:'flex',flexDirection:'column',margin:'10px' }} onClick={() => window.location.reload(false)}>Click to reload after transaction!</button>
           
          </div>
        </div>
      </div>
    );
  };
}

export default App;
