const defaultHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };
}

const currentUser = async (event, context, config) => {
  const userRepository = new UserRepository(context);
  const user = new User(event.headers['Authorization'], config ? config.useEmail : false);

  const userInfo = await userRepository.findUserInfo(user.getAccessToken());

  if (!userInfo) {
    ErrorMessages.userNotFound();
  }

  user.setUserAttributes(userInfo.UserAttributes);

  const userAccount = await userRepository.findUserAccount(user);
  user.setAccount(userAccount);

  console.log(userAccount);

  return user;
}

module.exports = {
  currentUser, defaultHeaders
};