import React, { Component } from 'react';
import './searchbox.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PopUp from './PopUp';
import autobind from 'class-autobind'
import { detachModifier } from '../utils/helper';

class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focusing: false,
      text: '',
      name: '',
      result: [],
      hasError: false,
    }
    autobind(this)
    this.backendUrl = 'https://protected-falls-80513.herokuapp.com/'
    this.apiKey = 'hungpham_ws_201200'
  }
  onFocus() {
    this.setState({ focusing: true })
  }
  onBlur() {
    this.setState({ focusing: true })
  }
  getName(string) {
    let listText = string.replace(/(\w)*:(\w|\?|\.|\!|\/|\,|\@|(\"+(\w|\s)*\"))*/g, '');
    return listText.trim();
  }
  onChange(value, callback) {
    let currentText = this.state.text;
    this.setState({
      text: this.getName(currentText) + ' ' + value,
    }, callback)
  }
  onChangeRawText(value) {
    this.setState({
      text: value
    })
  }
  
  onNormalChange(newText) {
    this.onChange(newText)
  }
  onEmitDirectSearch(newText) {
    this.onChange(newText, this.find)
  }
  find() {
    const { text } = this.state;
    const textUrl = this.generateUrl(text);
    this.search(textUrl)
  }
  generateUrl(text) {
    let name = this.getName(text);
    name = name.replace(/\s{2,}/g, ' ').trim();
    let rs = this.backendUrl + '?';
    rs = rs + 'api_key=' + this.apiKey + '&';
    if (name) rs += 'name=' + name + '&';

    let modifierText = '';
    let listModifier = text.match(/(\w)*:(\w|\?|\.|\!|\/|\,|\@|(\"+(\w|\s)*\"))*/g);
    if (listModifier)
      listModifier.forEach(element => {
        let text = element.trim().replace(/\"/g, '').replace(/\:/g, "=");
        modifierText += text + '&'
      });

    rs += modifierText;
    return rs;
  }

  formatText(object) {
    let { type, owner, content, date } = object;
    let rs = '';
    if (type) {
      if (type.value.trim()) {
        rs += (type.isNega ? 'type:!' : 'type:') + type.value.trim();
        rs += ' '
      }
    }
    if (owner) {
      if (owner.value.trim()) {
        if (owner.value.includes(' ')) rs += (owner.isNega ? 'owner:!' : 'owner:') + '"' + owner.value.trim() + '"';
        else rs += (owner.isNega ? 'owner:!' : 'owner:') + owner.value.trim();
        rs += ' '
      }
    }
    if (content) {
      if (content.value) {
        if (content.value.includes(' ')) rs += (content.isNega ? 'content:!' : 'content:') + '"' + content.value.trim() + '"';
        else rs += (content.isNega ? 'content:!' : 'content:') + content.value.trim();
        rs += ' '
      }
    }

    if (date.begin_time || date.end_time) {
      rs += (date.isNega ? 'date:!' : 'date:') + (date.begin_time ? date.begin_time : '') + (date.end_time ? ',' + date.end_time : '');
      rs += ' '
    }
    return rs.trim();
  }

  search(url) {
    this.setState({ focusing: false });
    this.props.sendRequest(url, (status) => {
      this.setState({
        focusing: false,
        text: status ? this.state.text : ''
      })
    })

  }
  render() {
    const option = (
      this.state.focusing ?
        <PopUp
          onEmitDirectSearch={this.onEmitDirectSearch}
          onNormalChange={this.onNormalChange}
          modifier ={detachModifier(this.state.text)}
          search = {this.find}
        ></PopUp>
        : ''
    )
    return (
      <div style={{ position: 'relative' }}>
        <div className={`box_search mx-5 px-1 rounded border  ${this.state.focusing ? 'focus' : 'border-light'}`}>
          <span className="icon_search fa fa-search">
          </span>
          <input
            type="text"
            className={'main_enter'}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={(e) => this.onChangeRawText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter')
                this.find()
            }}
            placeholder={'What do you want ?'}
            value={this.state.text}
          />
          <span
            className={' chevron fa fa-times pointer ' + (this.state.text === '' ? 'hidden' : '')}
            onClick={e => this.setState({ text: '' })}>
          </span>
          <span
            className={'chevron fa pointer ' + (this.state.focusing ? 'fa-chevron-up' : 'fa-chevron-down')}
            onClick={e => this.setState({ focusing: !this.state.focusing })}>
          </span>
        </div>
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          className={`additional_option border shadown ${this.state.focusing ? 'd-block' : 'd-none'}`}
        >
          {option}
        </ReactCSSTransitionGroup>

      </div>
    );
  }
}

export default SearchBox;