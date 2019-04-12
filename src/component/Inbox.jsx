import React, { Component } from 'react';
import './Inbox.css'
import autobind from 'class-autobind'

class Inbox extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    autobind(this)
  }
  render() {
    const listInbox = this.props.data.map((element, key) => {
      return (<div key={key} className={'p-2 border-bottom my-1 shadow-sm'}>
        <p className={'font-weight-bold mb-1 h5 justify-content-between d-flex'}>
          <span>
          <span className={'m-2 fa fa-user-circle-o'}></span>
          {element.ower}
          </span>
          <span className={'h6 text-capitalize'} style={{fontSize:'14px'}}>
            <span className={'fa fa-calendar mr-2'}></span>
            {element.date}
            <span className={'fa fa-bookmark mx-2'}></span>
            {element.type}
          </span>
        </p>
        <p className={'content_inbox mb-1'}>
          <span className={'m-2 fa fa-header'}></span>
          {element.name}
        </p>
        <p className="content_inbox">
          <span className={'m-2 fa fa-envelope-o'}>
          </span>
          <span>
          {element.content}
          </span>
        </p>
      </div>)
    });
    return (
      <div className={'col-lg-8 col-md-10 col-sm-12 mt-5 mx-auto text-left text-secondary'}>
        <h2 className={'border-bottom d-flex justify-content-between pb-2'}>
        <span>My Inbox</span> 
        <span className={'h6 mb-0'}>
          Total : {this.props.data.length} inboxs
        </span>
        </h2>
        <div>
          {
            this.props.data.length ?
              <div>
                {listInbox}
              </div>
              :
              <div>Empty</div>
          }
        </div>
      </div>
    )
  }

}

export default Inbox;