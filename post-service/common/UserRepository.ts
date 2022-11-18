import { UserAccount } from "./UserAccount";
import { DynamoDB, CognitoIdentityServiceProvider } from "aws-sdk";
import { User } from "./User";

const dynamo = new DynamoDB.DocumentClient();
const provider = new CognitoIdentityServiceProvider();

const TableName = 'AWS_USER_ACCOUNT';

export class UserRepository {
  findUserInfo = async (accessToken: string) => {
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

  findUserAccount = async (user: User) => {
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
      throw new Error('A user account could not be found for this user');
    } else {
      return new UserAccount(userAccountResults.Items[0]);
    }
  };
}