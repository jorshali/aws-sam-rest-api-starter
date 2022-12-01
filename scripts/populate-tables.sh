echo -----------------------------------------
echo Populating tables with default data...

SCRIPT_PATH=$(dirname -- "$(readlink -f "${BASH_SOURCE}")")

aws dynamodb put-item --table-name BLOG_POST --item "$(cat ${SCRIPT_PATH}/dynamo-data/blogposts/sample-blog-post1.json)"
aws dynamodb put-item --table-name BLOG_POST --item "$(cat ${SCRIPT_PATH}/dynamo-data/blogposts/sample-blog-post2.json)"

echo All tables have been populated.