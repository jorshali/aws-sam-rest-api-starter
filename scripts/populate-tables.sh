echo -----------------------------------------
echo Populating tables with default data...

SCRIPT_PATH=$(dirname -- "$(readlink -f "${BASH_SOURCE}")")

aws dynamodb put-item --table-name AWS_USER_ACCOUNT --item "$(cat ${SCRIPT_PATH}/dynamo-data/user_account/sample-user.json)"
aws dynamodb put-item --table-name POST --item "$(cat ${SCRIPT_PATH}/dynamo-data/post/sample-post1.json)"
aws dynamodb put-item --table-name POST --item "$(cat ${SCRIPT_PATH}/dynamo-data/post/sample-post2.json)"

echo All tables have been populated.