import Assets from './Assets';

export default new Assets().loadAssetsGroup('icons', {
  // header模块
  ico_back: require('../../assets/images/header/ico_back.png'),
  // 登录模块
  ico_wechat_login: require('../../assets/images/login/ico_wechat.png'),
  ico_phone: require('../../assets/images/login/ico_phone.png'),
  ico_yanzhengma: require('../../assets/images/login/ico_yanzhengma.png'),
  ico_password: require('../../assets/images/login/ico_password.png'),
  ico_reset_password: require('../../assets/images/login/ico_reset_password.png'),
});
