import * as fs from 'node:fs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";


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

        
        const params = event.queryStringParameters || {};

        //Delete
        if (params.action === "delete" && params.id) {
            await dynamo.send(new DeleteCommand({
                TableName: "formStore",
                Key: {
                    PK: "form",
                    SK: params.id
                }
            }));
        }

        //Edit
        else if (params.action === "edit" && params.id) {
            await dynamo.send(new UpdateCommand({
                TableName: "formStore",
                Key: {
                    PK: "form",
                    SK: params.id
                },
                UpdateExpression: "set #f = :form",
                ExpressionAttributeNames: {
                    "#f": "form"
                },
                ExpressionAttributeValues: {
                    ":form": {
                        name: params.name,
                        location: params.location
                    }
                }
            }));
        }

        // Only insert if it's a fresh submit
        else if (params.name || params.location) {
            await dynamo.send(new PutCommand({
                TableName: "formStore",
                Item: {
                    PK: "form",
                    SK: event.requestContext.requestId,
                    form: {
                        name: params.name,
                        location: params.location
                    }
                }
            }));
        }


        // Render HTML
        let modifiedHTML = dynamicForm(html, event.queryStringParameters);

        // ✅ Query DynamoDB (FIXED)
        const dbparams = {
            TableName: "formStore",
            KeyConditionExpression: "PK = :PK",
            ExpressionAttributeValues: {
                ":PK": "form"
            }
        };

        const tableQuery = await dynamo.send(new QueryCommand(dbparams));

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
            const item = tableQuery.Items[i];

            const id = item.SK;
            const name = item.form?.name || "";
            const location = item.form?.location || "";

            table +=    `
                        <li>
                            <b>Name:</b> ${name} |
                            <b>Location:</b> ${location}
                            
                            <!-- DELETE -->
                            <a href="/?action=delete&id=${id}">
                                <button>Delete</button>
                            </a>

                            <!-- EDIT -->
                            <form action="/" method="GET" style="display:inline;">
                                <input type="hidden" name="action" value="edit">
                                <input type="hidden" name="id" value="${id}">
                                <input type="text" name="name" value="${name}" />
                                <input type="text" name="location" value="${location}" />
                                <input type="submit" value="Update" />
                            </form>
                        </li>
                        `;
        }

        table = "<ul>" + table + "</ul>";
    }

    return html.replace("{table}", "<h4>DynamoDB:</h4>" + table);
}