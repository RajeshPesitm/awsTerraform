import * as fs from 'node:fs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Load HTML once
const html = fs.readFileSync('index.html', { encoding: 'utf8' });

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        // Handle favicon
        if (event.rawPath === '/favicon.ico') {
            return {
                statusCode: 204,
                body: ''
            };
        }

        // Store form data
        if (event.queryStringParameters) {
            await dynamo.send(new PutCommand({
                TableName: "formStore",
                Item: {
                    PK: "form",
                    SK: event.requestContext.requestId,
                    form: event.queryStringParameters
                }
            }));
        }

        // Render HTML
        let modifiedHTML = dynamicForm(html, event.queryStringParameters);

        // ✅ Query DynamoDB (FIXED)
        const params = {
            TableName: "formStore",
            KeyConditionExpression: "PK = :PK",
            ExpressionAttributeValues: {
                ":PK": "form"
            }
        };

        const tableQuery = await dynamo.send(new QueryCommand(params));

        // Add table to HTML
        modifiedHTML = dynamictable(modifiedHTML, tableQuery);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
            },
            body: modifiedHTML,
        };

    } catch (err) {
        console.error('Error:', err);

        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};

function dynamicForm(html, queryStringParameters = {}) {
    let formres = '';

    Object.values(queryStringParameters).forEach(val => {
        formres += val + ' ';
    });

    return html.replace(
        '{formResults}',
        `<h4>Form Submission: ${formres.trim()}</h4>`
    );
}

function dynamictable(html, tableQuery) {
    let table = "";

    if (tableQuery.Items && tableQuery.Items.length > 0) {
        for (let i = 0; i < tableQuery.Items.length; i++) {
            table += "<li>" + JSON.stringify(tableQuery.Items[i]) + "</li>";
        }
        table = "<pre>" + table + "</pre>";
    }

    return html.replace("{table}", "<h4>DynamoDB:</h4>" + table);
}
