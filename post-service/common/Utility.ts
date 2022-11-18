import { User } from "./User";
import { UserRepository } from "./UserRepository";


export class Utility {
  static defaultHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };
  }

  static currentUser = async (event: any, config: any) => {
    const userRepository = new UserRepository();
    const user = new User(event.headers['Authorization'], config ? config.useEmail : false);

    const userInfo: any = await userRepository.findUserInfo(user.getAccessToken());

    if (!userInfo) {
      throw new Error('A user account could not be found for this user');
    }

    user.setUserAttributes(userInfo.UserAttributes);

    const userAccount = await userRepository.findUserAccount(user);
    user.account = userAccount;

    console.log(userAccount);

    return user;
  };
}