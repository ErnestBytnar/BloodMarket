import React from 'react';
import './App.css';
import axios from 'axios';


class App extends React.Component{

  state = {
    details: [],
  };

  componentDidMount(){

    let data;

    axios.get('http://localhost:8000')
    .then(res => {
      data = res.data;
      this.setState({
        details: data
      });
    })
    .catch(err => { })

  }


  render(){
    return (
      <div>
        <header>
          The Following Data Came for Django Backend at localhost 8000.
        </header>
        <hr></hr>

      </div>
    )
  }

}

export default App;