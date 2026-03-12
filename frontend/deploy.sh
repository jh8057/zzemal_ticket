#!/bin/bash
# S3 배포 스크립트
# 사용법: S3_BUCKET=my-bucket-name ./deploy.sh

set -e

if [ -z "$S3_BUCKET" ]; then
  echo "Error: S3_BUCKET 환경변수가 필요합니다."
  echo "  S3_BUCKET=my-bucket-name ./deploy.sh"
  exit 1
fi

echo "Building..."
npm run build

echo "Deploying to s3://$S3_BUCKET ..."
aws s3 sync dist/ s3://$S3_BUCKET --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# index.html은 캐시 무효화
aws s3 cp dist/index.html s3://$S3_BUCKET/index.html \
  --cache-control "no-cache, no-store, must-revalidate"

echo "Done! https://$S3_BUCKET.s3-website.ap-northeast-2.amazonaws.com"
