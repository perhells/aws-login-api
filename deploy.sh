#!/bin/bash

# dev:   ./deploy.sh
# prod:  ./deploy.sh prod

set -e
set -o nounset
set -o pipefail

STAGE=${1:-dev}
PROJECT=cognito-login-api-$STAGE

# Change the suffix on the bucket to something unique!
BUCKET=$PROJECT-pehe

# make a build directory to store artifacts
rm -rf build
mkdir build

# make the deployment bucket in case it doesn't exist
if aws s3 ls | sed -e "s/^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\} [0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\} //" | grep "^$BUCKET\$"; then
    echo "Bucket $BUCKET exists, skipping!"
else
    aws s3 mb s3://$BUCKET
fi

# generate next stage yaml file
aws cloudformation package                      \
    --template-file template.yaml               \
    --output-template-file build/output.yaml    \
    --s3-bucket $BUCKET

# the actual deployment step
aws cloudformation deploy                       \
    --template-file build/output.yaml           \
    --stack-name $PROJECT                       \
    --capabilities CAPABILITY_NAMED_IAM         \
    --parameter-overrides "Environment=$STAGE"

aws cloudformation describe-stacks \
    --stack-name $PROJECT --query 'Stacks[].Outputs'
