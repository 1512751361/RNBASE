import React, { PureComponent } from 'react';
import DeviceInfo from 'react-native-device-info';
import DateTimePicker from './index';
import RNRootSiblings from '../rootSiblings';

class RNDateTimePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.show = this.show.bind(this);
  }

  show = (props) => {
    const sibling = RNRootSiblings.show(<DateTimePicker
        {...props}
        isVisible
        titleIOS="选择日期"
        locale={DeviceInfo.getDeviceLocale()}
        mode="date"
      // timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
      // onConfirm={this.onDateChange}
        onCancel={() => RNRootSiblings.hide(sibling)}
    />, {
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

export default new RNDateTimePicker();
