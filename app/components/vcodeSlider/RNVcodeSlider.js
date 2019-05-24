import React, { PureComponent } from 'react';
import ReactVCodeSlider from './index';
import RNRootSiblings from '../rootSiblings';

class RNVCodeSlider extends PureComponent {
  constructor(props) {
    super(props);
    this.show = this.show.bind(this);
  }

  show = (props) => {
    const sibling = RNRootSiblings.show(<ReactVCodeSlider {...props} />);
  }

  render() {
    return null;
  }
}

export default new RNVCodeSlider();
