const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const provider = new AWS.CognitoIdentityServiceProvider();

const UserAccount = require('./UserAccount');
const ErrorMessages = require('./ErrorMessages');

const TableName = 'AWS_USER_ACCOUNT';

class UserRepository {
  constructor(context) {
    this.context = context;
  }
  
  findUserInfo = async (accessToken) => {
    return new Promise((resolve, reject) => {
      provider.getUser({
        AccessToken: accessToken
      }, (err, userInfo) => {
        if (err) {
          reject(err);
        }

        resolve(userInfo);
      });
    });
  };

  findUserAccount = async (user) => {
    const username = user.getUsername().toLowerCase();

    console.log(username);

    const userAccountResults = await dynamo.query({
      TableName,
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username
      }
    }).promise();

    if (!userAccountResults || !userAccountResults.Items || userAccountResults.Items.length === 0) {
      ErrorMessages.userNotFound();
    }

    return new UserAccount(userAccountResults.Items[0]);
  };
}

module.exports = UserRepository;