SCRIPT_PATH=$(dirname -- "$(readlink -f "${BASH_SOURCE}")")

echo Adding a REST API User.
echo -----------------------------------------
echo Enter the UserPoolId for the generated Cognito User Pool:
read USER_POOL_ID
echo Enter the email address for the user you want to create:
read USER_EMAIL_ADDRESS
echo Enter the temporary password for the user \(will be forced to change\):
read -s USER_TEMP_PASSWORD
echo -----------------------------------------

USER_ACCOUNT_ITEM=$(<$SCRIPT_PATH/dynamo-data/user_account/default-user.json)
USER_ACCOUNT_ITEM=${USER_ACCOUNT_ITEM//$'\n'/}

aws cognito-idp admin-create-user --user-pool-id $USER_POOL_ID --username $USER_EMAIL_ADDRESS --temporary-password $USER_TEMP_PASSWORD --user-attributes Name=email,Value=$USER_EMAIL_ADDRESS Name=email_verified,Value=True
aws dynamodb put-item --table-name AWS_USER_ACCOUNT --item "${USER_ACCOUNT_ITEM/USER_NAME/$USER_EMAIL_ADDRESS}"

echo User added successfully.