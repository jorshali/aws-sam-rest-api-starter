# Step 0 - Install required tools

1.  Follow the guide:

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html

# Step 1 - Create a profile

1.  Go to IAM and access Users

2.  Add User with a user name:  create Group called Administrator (if it doesn't exist), assign AdministratorAccess, and assign to user.  Make sure to check that the user does not have to reset password on next login.

3.  Check password and secret key access for the user

4.  Use the AWS secret ID and secret key for the local profile:

```
mkdir ~/.aws
cd ~/.aws
vi config
```

Add the following:

```
[default]
region = us-west-2

[profile rest-api-starter-profile]
region=us-west-2
output=json
```

vi credentials

Add the following:

```
[rest-api-starter-profile]
aws_access_key_id=<your-access-key-id>
aws_secret_access_key=<your-secret-access-key>
```

# How to change profiles

```
export AWS_PROFILE=rest-api-starter-profile
```

# How to deploy an environment

1.  First create an account, setup a user with Admin rights, and a local profile.

2.  Set your profile with the export command according to your environment

3.  Now build the environment:

```
sam build
```

4.  Then deploy to the environment using the profile:

```
sam deploy --guided
```