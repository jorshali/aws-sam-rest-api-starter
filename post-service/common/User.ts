import { UserAccount } from "./UserAccount";

import jwt_decode from "jwt-decode";

export class User {
  accessToken: string;
  tokenPayload: any;
  useEmail: boolean;
  account: UserAccount;
  userAttributes: any;

  constructor(authHeader: string, useEmail: boolean) {
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

  setUserAttributes(attributes: {[key: string]: any}) {
    this.userAttributes = attributes;
  }

  getEmail() {
    return this.getUserAttributeValue('email');
  }

  getUserAttributeValue(key: string) {
    const userAttribute = this.userAttributes.find((attribute: any) => attribute.Name === key);

    return userAttribute ? userAttribute.Value : null;
  }
}