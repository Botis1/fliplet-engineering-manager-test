# Scalability Plan for Image Processing

## Challenge

Handling 10M+ images per day.

## Solution

The application will be serverless and event-driven.

For the frontend app, we can create a lightweight mobile app or a responsive Native React web app so it is available for low bandwidth environments.
Frontend design features:
Lazy loading, so that images are only loaded when they are in the viewport

Compress images client-side to reduce the upload bandwidth needed

Leverage local device cache for images frequently viewed to reduce bandwidth needed

Use backoffs for retry requests to reduce load

Backend key components and technology to use.
AWS API Gateway to expose endpoints for image retrieval and other operations.

API Gateway’s HTTP API for lower cost and latency compared to REST API.

- Integrate authentication into AWS Cognito.
- Rate limit for abuse

AWS Lambda (compute) for processing requests, resizing images, and handling business logic.

- Attach Lambdas to API Gateway for processing authentication and serving requests
- Use Lambda and S3 to create presigned URLs so user data uploads straight into the bucket.
- Use trigger features in S3 to start a single or chain of background tasks to process the image in the S3 bucket(s).
- Use DynamoDB Triggers so when data is inserted, updated, or deleted from a table, this will start a background event if needed.

AWS DynamoDB for metadata storage (e.g., image IDs, URLs, user data)

AWS SQS for messaging, background tasks, and communication inside of AWS

- SQS can also be put in between API Gateway and Lambda when a queue is needed.

AWS CloudFront for global content delivery and caching to reduce latency and bandwidth usage.

AWS Amazon CloudWatch for logging, metrics, and alerts.
