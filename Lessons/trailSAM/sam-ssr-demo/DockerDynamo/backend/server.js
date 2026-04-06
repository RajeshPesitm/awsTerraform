const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// DynamoDB config (same as your Python setup)
AWS.config.update({
  region: "us-west-2",
  endpoint: "http://dynamodb:8000",
  accessKeyId: "fakeMyKeyId",
  secretAccessKey: "fakeSecretAccessKey",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE = "Student";

// GET all students
app.get("/students", async (req, res) => {
  try {
    const data = await dynamodb.scan({ TableName: TABLE }).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new student
app.post("/students", async (req, res) => {
  const { Roll, Name } = req.body;

  try {
    await dynamodb
      .put({
        TableName: TABLE,
        Item: { Roll, Name },
      })
      .promise();

    res.json({ message: "Student added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});