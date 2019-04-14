import React, { Component } from 'react';
import Select from 'react-select';
import './PopUp.css'
import autobind from 'class-autobind'
import moment from 'moment';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import { modifierTextToObject, capitizeCase, mergeModifier } from '../utils/helper';
class PopUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show_more: true,
      listType: [],
      owner_option: '',
      content: '',
      type_select: null,
      owner_select: null,
      owner_custom: '',
      date_select: null,
      begin_time: moment().subtract(1, 'days'),
      end_time: moment(),
      show_input_owner: false,
      show_input_time: false,
      currentTypeActive :'',
    }
    autobind(this)
  }
  componentDidMount() {
    this.setState({
      listType: [
        'any Type',
        'page',
        'article',
        'advertisement',
        'blog',
      ],
    })
    this.observe();
  }
  componentDidUpdate(prevProps) {
    let { modifier } = this.props;
    if (prevProps.modifier !== modifier) {
      this.observe();
    }
  }
  observe(){
    let { modifier } = this.props;
    const objectMod = modifierTextToObject(modifier);
    let { type, owner, date } = objectMod;
    this.observeType(type);
    this.observeOwner(owner);
    this.observeDate(date);
  }
  observeType(type) {
    if (type.value) {
      this.setState({
        type_select: {
          value: type.value,
          label: capitizeCase(type.value)
        },
        currentTypeActive :type.value,
      })
    } else this.setState({
      type_select: null
    })
  }
  observeOwner(owner) {
    if (owner.value) {
      let value = owner.value.toLowerCase();
      if (value == 'me' && owner.isNega) value = 'not me'
      if (value != 'me' && value != 'not me') {
        this.setState({
          show_input_owner: true,
          owner_custom: value,
          owner_select: {
            value: 'specific owner...',
            label: capitizeCase('specific owner...')
          }
        })
      } else {
        this.setState({
          show_input_owner: false,
          owner_select: {
            value: value,
            label: capitizeCase(value)
          }
        })
      }

    }
    else this.setState({
      owner_select: null
    })
  }
  observeDate(date) {
    if (date.begin_time || date.end_time) {
      let begin_time = moment(date.begin_time, 'MM/DD/YYYY');
      let end_time = moment(date.end_time, 'MM/DD/YYYY');
      if (!end_time.isValid() && begin_time.isValid()) {
        // specify choose
        let svalue = '';
        let times = date.begin_time;
        if (times === moment().format('MM/DD/YYYY')) svalue = 'today';
        if (times === moment().subtract(1, 'days').format('MM/DD/YYYY')) svalue = 'yesterday';
        if (times === moment().subtract(7, 'days').format('MM/DD/YYYY')) svalue = 'last week';
        if (times === moment().subtract(1, 'months').format('MM/DD/YYYY')) svalue = 'last month';
        if (svalue)
          this.setState({
            show_input_time: false,
            date_select: {
              value: svalue,
              label: capitizeCase(svalue)
            }
          })
        else {
          this.setState({
            show_input_time: true,
            begin_time: begin_time,
            date_select: {
              value: 'custom time...',
              label: capitizeCase('custom time...')
            }
          })
        }
      }
      else if (end_time.isValid() || begin_time.isValid()) {
        this.setState({
          show_input_time: true,
          begin_time: begin_time,
          end_time: end_time,
          date_select: {
            value: 'custom time...',
            label: capitizeCase('custom time...')
          }
        })
      }
    }
    else this.setState({
      date_select: null
    })

  }

  formatObject() {
    let { type, owner, content, date } = this.state;
    return {
      type,
      owner,
      content,
      date
    }
  }
  onChooseTypeDirect(e) {
      this.props.onEmitDirectSearch(mergeModifier(this.props.modifier,'type',{
        value: e,
        isNega: false
      })
    )
  }
  onChooseType(object) {
    let {value} = object
    if(value == 'any Type') value = ''
    this.props.onNormalChange(mergeModifier(this.props.modifier,'type',{
      value: value,
      isNega: false
    }))
  }
  onChooseOwner(object) {
    this.setState({
      owner_select: object
    })
    let e = object.value;
    let value = ''
    let isNega = false
    if (e === 'me') value = 'me';
    else if (e === 'not me') { value = 'me'; isNega = true }
    else if (e === 'anyone') { value = '' }
    else if (e === 'specific owner...') { value = 'show_input_owner' }
    else { value = e.trim(); }
    this.props.onNormalChange(mergeModifier(this.props.modifier,'owner',{
      value: value,
      isNega: isNega
    }))
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
    this.props.onNormalChange(mergeModifier(this.props.modifier,'date',{
      begin_time: begin_time,
      end_time: end_time,
      isNega: false
    }))
  }
  handleChange = (type, moment) => {
    this.setState({
      [type]: moment,
    },()=>{
      this.props.onNormalChange(mergeModifier(this.props.modifier,'date',{
        begin_time: this.state.begin_time.format('MM/DD/YYYY'),
        end_time: this.state.end_time.format('MM/DD/YYYY'),
        isNega: false
      }))
    });
     
  }
  customInputOwner(value) {
    this.setState({ owner_custom: value });
  }
  render() {
    const listType = this.state.listType.map((element, k) => {
      if(k > 0)
      return <p key={k}
      className={this.state.currentTypeActive == element ? 'bg-info text-white' : ''}
       onClick={(e) => this.onChooseTypeDirect(element)}>
        {element}
      </p>
    })
    const showMore = (
      <div className={'show_more col-sm-12 col-sm-10 m-auto p-md-5 p-sm-2'}>
        <div className={'col-lg-6 col-md-10 col-sm-12 m-lg-0 m-md-auto float-left'}>
          <span>Type : </span>
          <Select
            value={this.state.type_select}
            onChange={(value) => this.onChooseType(value)}
            options={this.state.listType.map(e => { return { value: e, label: e.charAt(0).toUpperCase() + e.slice(1) } })}
          />
        </div>
        <div className={'p-0 col-12'}></div>
        <div className={'col-lg-6 col-md-10 col-sm-12 m-lg-0 m-md-auto float-left'}>
          <span>Owner : </span>
          <Select
            value={this.state.owner_select}
            onChange={(value) => this.onChooseOwner(value)}
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
                  value={this.state.owner_custom}
                  onChange={e => this.customInputOwner(e.target.value)}
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
        {/* <div className={'col-sm-12 col-md-10'}>
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
         */}
        <div className={'col-md-6 col-sm-12'}>
          <span>Time : </span>
          <Select
            value={this.state.date_select}
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
          <button className={'btn btn-primary rounded-pill'} onClick={() => this.props.search()}>Search</button>
          <button className={'btn rounded-pill btn-outline-info mx-2'} onClick={() => this.setState({ showMore: false })}>Back</button>
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