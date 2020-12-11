import react, { Component } from 'react'
import '../css/App.css';
import AddAppointements from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';
import {findIndex, without} from 'lodash';


class App extends Component {

  constructor(){
      super();
      this.state = {
          myAppointments: [],
          formDisplay: false,
          lastIndex: 0,
          orderBy: 'petName',
          orderDir: 'asc',
          queryText: ''
      };
      this.deleteAppointment = this.deleteAppointment.bind(this)
      this.toggleForm = this.toggleForm.bind(this)
      this.addAppointement = this.addAppointement.bind(this)
      this.changeOrder = this.changeOrder.bind(this)
      this.searchBy = this.searchBy.bind(this)
      this.updateInfo = this.updateInfo.bind(this)
  }

  addAppointement(apt){
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    });
  }

  toggleForm(){
    this.setState({formDisplay: !this.state.formDisplay})
  }

  searchBy(word){
    this.setState({queryText: word})
  }

  deleteAppointment(apt){
      let apts = this.state.myAppointments;
      apts = without(apts, apt);
      this.setState({myAppointments: apts});
  }

  changeOrder(order, dir){
      this.setState({orderBy: order,
      orderDir: dir
    });
  }

  updateInfo(name, value, id){
    let tempApts = this.state.myAppointments
    let aptIndex = findIndex(this.state.myAppointments, {
      aptID: id
    });
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppointments: tempApts
    });
  }
  componentDidMount(){
      fetch('./data.json')
        .then(response => response.json())
        .then(result => {
          const apts = result.map(item => {
            item.aptID= this.state.lastIndex;
            this.setState({lastIndex: this.state.lastIndex + 1})
            return item;
          })
          this.setState({
            myAppointments: apts
          });
        });   
  }


  render(){
    
  let order;
  let filteredApts = this.state.myAppointments;
  if (this.state.orderDir === 'asc') {
    order = 1;
  }else{
    order = -1;
  }
  filteredApts = filteredApts.sort((a,b) => {
    if (a[this.state.orderBy].toLowerCase() < 
        b[this.state.orderBy].toLowerCase()
        )
    {
      return -1 * order;
    }
    else {
      return 1 * order;
    }
  }).filter(eachItem => {
      return(
        eachItem['petName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase())
      )
  })
  
  return (
    <main className="page bg-white" id="petratings">
    <div className="container">
      <div className="row">
        <div className="col-md-12 bg-white">
          <div className="container">
            <AddAppointements 
              formDisplay = {this.state.formDisplay}
              toggleForm = {this.toggleForm}
              addAppointement = {this.addAppointement}
            />
            <SearchAppointments orderBy = {this.state.orderBy}
              orderDir = {this.state.orderDir}
              changeOrder = {this.changeOrder}
              searchBy = {this.searchBy}
            />
            <ListAppointments appointments = {filteredApts}
            deleteAppointment={this.deleteAppointment}
            updateInfo={this.updateInfo}
            />
          </div>
        </div>
      </div>
    </div>
  </main>
  );
}
}

export default App;
