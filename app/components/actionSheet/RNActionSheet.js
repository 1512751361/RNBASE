import React, { PureComponent } from 'react';
import ActionSheet from './ActionSheet';
import RNRootSiblings from '../rootSiblings';

class RNActionSheet extends PureComponent {
  constructor(props) {
    super(props);
    this.show = this.show.bind(this);
  }

  show = (props) => {
    RNRootSiblings.show(<ActionSheet {...props} isFristIOS visible />, {
      containerStyle: {
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
      },
    });
  }

  render() {
    return null;
  }
}

export default new RNActionSheet();
