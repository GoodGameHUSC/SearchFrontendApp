import React, { Component } from 'react';
import './App.css';
import SearchBox from './component/SearchBox';
import Axios from 'axios';
import  autobind  from 'class-autobind';
import Inbox from './component/Inbox';
//   Axios.get(url)
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      data : [],
      hasError : false
    }
    autobind(this);
  }
  componentDidMount(){
    this.sendRequest('https://protected-falls-80513.herokuapp.com/?api_key=hungpham_ws_201200',(value)=>null)
  }
  sendRequest(url, callback){
      Axios.get(url)
      .then(response =>{
          this.setState({data :response.data.data || []},() =>callback(true))
      })
      .catch(e=> this.setState({
        data :[],
        hasError : true
      }, () =>callback(false)))
  }
  render() {
    return (
      <div className="App">
        <header className="App-header px-md-5 px-sm-0 shadow">
        <p className="title p-2">Global<span>Search</span></p>
        <SearchBox sendRequest={this.sendRequest}></SearchBox>
       
        </header>
        <Inbox data={this.state.data}></Inbox>
      </div>
    ); 
  }  
}

export default App;
