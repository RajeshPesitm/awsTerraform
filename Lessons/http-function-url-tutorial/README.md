### Original Reference
- [Tutorial](https://serverlessland.com/getting-started/lambda/)

### Important Updates in this Commit2:
- Added Update / Delete Buttons
- Updated policy attached to role of Lanbda function (Lamda->Role->policy)

    ```JSON
        {
        "Effect": "Allow",
        "Action": [
            "dynamodb:DeleteItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:Query"
        ],
        "Resource": "*"
        }
    ```
- Lets see whats coming next
