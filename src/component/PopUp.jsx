import React, { Component } from 'react';
import Select from 'react-select';
import './PopUp.css'
import autobind from 'class-autobind'
import moment from 'moment';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
class PopUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show_more: true,
      listType: [],
      type: {
        value: '',
        isNega: false
      },
      owner: {
        value: '',
        isNega: false
      },
      content: {
        value: '',
        isNega: false
      },
      time: {
        begin_time: null,
        end_time: null,
        isNega: false,
      },
      begin_time: moment().subtract(1, 'days'),
      end_time: moment(),
      show_input_owner: false,
      show_input_time: false,
    }
    autobind(this)
  }
  componentDidMount() {
    this.setState({
      listType: [
        'page',
        'article',
        'advertisement',
        'blog',
      ],
    })
  }

  formatObject() {
    let { type, owner, content, time } = this.state;
   
    return {
      type,
      owner,
      content,
      time
    }
  }
  onChooseTypeDirect(e) {
    this.setState({
      type: {
        value: e,
        isNega: false
      }
    }, () => {
      // this.props.onEmit(this.formatObject())
      this.props.onEmitDirectSearch(this.formatObject())
    })
  }
  onChooseType(e) {
    this.setState({
      type: {
        value: e,
        isNega: false
      }
    }, () => {
      this.props.onNormalChange(this.formatObject())
    })
  }
  onChooseOwner(e) {
    let value = ''
    let isNega = false
    if (e === 'me') value = 'me';
    else if (e === 'not me') { value = 'me'; isNega = true }
    else if (e === 'anyone') { value = '' }
    else if (e === 'specific owner...') { value = 'show_input_owner' }
    else { value = e.trim(); }
    this.setState({
      owner: {
        value: value,
        isNega: isNega
      }
    },
      () => {
        if (this.state.owner.value !== 'show_input_owner') {
          const {value} = this.state.owner
          if(value === 'me' || value === 'not me' || value === 'anyone')
          this.setState({ show_input_owner: false })
          this.props.onNormalChange(this.formatObject())
        }
        else this.setState({ show_input_owner: true, owner: { value: '', isNega: false } })
      }
    )
  }
  onChangeContent(value) {
    this.setState({
      content: {
        value: value.trim(),
        isNega: false
      }
    }, () => {
      this.props.onNormalChange(this.formatObject())
    })
  }

  onChooseTime(e) {
    let begin_time = null;
    let end_time = null;
    let today = moment();
    if (e === 'custom time...') {
      this.setState({ show_input_time: true });
      return;
    }
    if (e === 'today') {
      begin_time = today.format('MM/DD/YYYY');
    }
    if (e === 'yesterday') {
      begin_time = today.subtract(1, 'days').format('MM/DD/YYYY');
    }
    // 'last week', 'last month', 'custom time...'
    if (e === 'last week') {
      begin_time = today.subtract(7, 'days').format('MM/DD/YYYY');
    }
    if (e === 'last month') {
      begin_time = today.subtract(1, 'months').format('MM/DD/YYYY');
    }
    this.setState({
      show_input_time : false,
      time: {
        begin_time: begin_time,
        end_time: end_time,
        isNega: false
      }
    }, () => {
      this.props.onNormalChange(this.formatObject())
    })
  }
  handleChange = (type, moment) => {
    let begin_time = (type === 'begin_time') ? moment.format('MM/DD/YYYY') : this.state.time.begin_time;
    let end_time = (type === 'end_time') ? moment.format('MM/DD/YYYY') : this.state.time.end_time;
    this.setState({
      [type]: moment,
      time: {
        begin_time: begin_time,
        end_time: end_time,
        isNega: false
      }
    }, () => {
      this.props.onNormalChange(this.formatObject())
    });
  }

  render() {
    const listType = this.state.listType.map((element, k) => {
      return <p key={k} onClick={(e) => this.onChooseTypeDirect(element)}>
        {element}
      </p>
    })
    const showMore = (
      <div className={'show_more col-sm-12 col-sm-10 m-auto p-md-5 p-sm-2'}>
        <div className={'col-lg-6 col-md-10 col-sm-12 m-lg-0 m-md-auto float-left'}>
          <span>Type : </span>
          <Select
            onChange={(ob) => this.onChooseType(ob.value)}
            options={this.state.listType.map(e => { return { value: e, label: e.charAt(0).toUpperCase() + e.slice(1) } })}
          />
        </div>
        <div className={'p-0 col-12'}></div>
        <div className={'col-lg-6 col-md-10 col-sm-12 m-lg-0 m-md-auto float-left'}>
          <span>Owner : </span>
          <Select
            onChange={(ob) => this.onChooseOwner(ob.value)}
            options={['anyone', 'me', 'not me', 'specific owner...'].map(e => { return { value: e, label: e.charAt(0).toUpperCase() + e.slice(1) } })}
          />
        </div>
        {
          this.state.show_input_owner ?
            <div className={'col-lg-6 col-md-10 col-sm-12 m-lg-0 m-md-auto float-left'}>
              <span>Name or Email : </span>
              <div>
                <input
                  className={'form-control'}
                  value={this.state.owner.value}
                  onChange={e => this.setState({ owner: { value: e.target.value, isNega: false } })}
                  onKeyDown={e => {
                    if (e.key === 'Enter')
                      this.onChooseOwner(this.state.owner.value)
                  }}
                />
              </div>
            </div>
            : ''
        }
        <div className={'p-0 col-12'}></div>
        <div className={'col-sm-12 col-md-10'}>
          <span>Content : </span>
          <div>
            <input
              className={'form-control'}
              value={this.state.content.value}
              onChange={e => this.setState({ content: { value: e.target.value, isNega: false } })}
              onKeyDown={e => {
                if (e.key === 'Enter')
                  this.onChangeContent(this.state.content.value)
              }}
            />
          </div>
        </div>
        <div className={'col-md-6 col-sm-12'}>
          <span>Time : </span>
            <Select
              onChange={(ob) => this.onChooseTime(ob.value)}
              options={['any time', 'today', 'yesterday', 'last week', 'last month', 'custom time...'].map(e => { return { value: e, label: e.charAt(0).toUpperCase() + e.slice(1) } })}
            />
        </div>
        <div className={'p-0 col-12'}></div>
        {
          this.state.show_input_time ?
            <div className={'col-lg-6 col-md-10 col-sm-12 m-lg-0 m-md-auto float-left'}>
              <span>From:</span>
              <div>
                <DatetimePickerTrigger
                  // shortcuts={shortcuts} 
                  moment={this.state.begin_time}
                  onChange={(e) => this.handleChange('begin_time', e)}>
                  <input className={'form-control text-center text-info bg-light'} type="text" value={this.state.begin_time.format('YYYY-MM-DD HH:mm')} readOnly />
                </DatetimePickerTrigger>
              </div>
            </div>
            : ''
        }
        {
          this.state.show_input_time ?
            <div className={'col-lg-6 col-md-10 col-sm-12 m-lg-0 m-md-auto float-left'}>
              <span>To :</span>
              <div>
                <DatetimePickerTrigger
                  // shortcuts={shortcuts} 
                  moment={this.state.end_time}
                  onChange={(e) => this.handleChange('end_time', e)}>
                  <input className={'form-control text-center text-info bg-light'} type="text" value={this.state.end_time.format('YYYY-MM-DD HH:mm')} readOnly />
                </DatetimePickerTrigger>
              </div>
            </div>
            : ''
        }
        <div className={'col-12 justify-content-center justify-content-md-start pt-5 text-center'}>
          <button className={'btn btn-primary rounded-pill'} onClick={()=>this.props.onEmitDirectSearch(this.formatObject())}>Search</button>
          <button className={'btn rounded-pill btn-outline-info mx-2'} onClick={()=> this.setState({showMore : false})}>Back</button>
        </div>
      </div>
    )
    return (
      !this.state.showMore ?
        <div className={'list_type'}>
          {listType}
          <p className={'more_search'} onClick={e => this.setState({ showMore: true })}>
            <button className={'btn btn-outline-info rounded-pill'}>More Search Tools </button>
          </p>
        </div>
        : showMore
    );
  }
}

export default PopUp;