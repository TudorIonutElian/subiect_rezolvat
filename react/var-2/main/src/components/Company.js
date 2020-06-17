import React, { Component } from 'react'

class Company extends Component {
  constructor(){
    super()
    this.state = {
      showCompanyDetails: false
    }
  }

  showCompanyDetails = () =>{

    this.setState({showCompanyDetails: true})
  }
  render() {
    let {item} = this.props
    let show   = false;
    if(show){
      return <CompanyDetails />
    }
    return (
      <div>
    		Name {item.name} with {item.employees} employees {item.revenue} revenue
        <button onClick={this.showCompanyDetails} value="select">Select</button>
        <button value="cancel">Cancel</button>
        {show}

      </div>
    )
  }
}

export default Company
