const jwt_decode = require('jwt-decode');

class User {
  constructor(authHeader, useEmail) {
    const accessToken = authHeader.replace('Bearer ', '');
    const tokenPayload = jwt_decode(accessToken);

    this.accessToken = accessToken;
    this.tokenPayload = tokenPayload;
    this.useEmail = useEmail;
  }
  
  getAccessToken() {
    return this.accessToken;
  }

  getUsername() {
    return this.useEmail ? this.getEmail() : this.tokenPayload['username'];
  }

  getAccount() {
    return this.account;
  }

  setAccount(account) {
    this.account = account;
  }

  setUserAttributes(attributes) {
    this.userAttributes = attributes;
  }

  getEmail() {
    return this.getUserAttributeValue('email');
  }

  getUserAttributeValue(key) {
    const userAttribute = this.userAttributes.find((attribute) => attribute.Name === 'email');

    return userAttribute ? userAttribute.Value : null;
  }
}

module.exports = User;