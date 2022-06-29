require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");

const app = express();

app.use(cors());
app.use(fileupload());

app.listen(3001, (req, res) => {
  console.log("server running");
});

const aws = require("aws-sdk");

// AWS IAM user configuration
aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});
const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();

// API to get signed url
app.get("/get-signed-url", async (req, res) => {
  await s3.createPresignedPost(
    {
      Fields: {
        key: req.headers.filename,
      },
      Conditions: [
        ["starts-with", "$Content-Type", "image/"],
        ["content-length-range", 0, 1000000],
      ],
      Expires: 600,
      Bucket: BUCKET,
    },
    (err, signed) => {
      res.json(signed);
    }
  );
});

// API for fetching files from  S3 Bucket

app.get("/getfiles", async (req, res) => {
  let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
  let x = r.Contents.map((item) => item.Key);
  res.send(x);
});

// API to download the file
app.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename;
  let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
  res.send(x.Body);
});
