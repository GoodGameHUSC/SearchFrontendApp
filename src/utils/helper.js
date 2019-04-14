export function detachModifier(string) {
  let listModifier = string.match(/(\w)+:(\w|\?|\.|\!|\/|\,|\@|(\"+(\w|\s)*\"))+/g);
  if (listModifier) return listModifier.join(' ');
  return ''
}
export function capitizeCase(e) {
  if (e)
    return e.charAt(0).toUpperCase() + e.slice(1)
  return ''
}
export function modifierTextToObject(string) {
  let resultObject = {
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
    date: {
      begin_time: null,
      end_time: null,
      isNega: false,
    },
  };
  let listModifier = string.match(/(\w)+:(\w|\?|\.|\!|\/|\,|\@|(\"+(\w|\s)*\"))+/g);
  if (listModifier) {
    listModifier.forEach(stringModifier => {
      stringModifier = stringModifier.trim();
      ['type', 'owner', 'content', 'date'].forEach(type => {
        const detectRs = detect(type, stringModifier);
        if (detectRs) resultObject = { ...resultObject, [type]: detectRs }
      })
    })
  }
  return resultObject;
}

function detect(type, string) {
  if (string.includes(type + ':'))
    if (type !== 'date')
      return {
        value: string.replace(type + ':', '').replace('!', ''),
        isNega: string.replace(type + ':', '').charAt(0) === '!'
      }
    else {
      string = string.replace('date:', '');
      let isNega = string.charAt(0) == '!'
      string = string.replace('!', '');
      return {
        begin_time: string.split(',')[0] || null,
        end_time: string.split(',')[1] || null,
        isNega: isNega
      }
    }
  else
    return null;
}

export function mergeModifier(currentString, newOptionType, newOptionValue){
  let currentModifier = modifierTextToObject(currentString);
  let newObject =  {
    ...currentModifier,
    [newOptionType] : newOptionValue
  }
  return generatorModifierString(newObject) ; 
}

function generatorModifierString(object){
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



// function componentDidUpdate() {

//   // change text detect
//   // text -> configure
//   const currentText = this.state.text
//   if (currentText !== prevState.text) {
//     let listModifier = currentText.match(/(\w)*:(\w|\?|\.|\!|\/|\,|\@|(\"+(\w|\s)*\"))*/g);
//     let resultObject = prevState.configure;
//     if (listModifier) {
//       listModifier.forEach(stringModifier => {
//         stringModifier = stringModifier.trim();
//         ['type', 'owner', 'content', 'date'].forEach(type => {
//           const detectRs = this.detect(type, stringModifier);
//           if (detectRs) resultObject = { ...resultObject, [type]: detectRs }
//         })
//       })
//     }
//     this.setState({ configure: resultObject })
//   }

//   // change object detect
// 