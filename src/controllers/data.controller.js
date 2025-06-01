import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
    region: process.env.AWS_REGION
});
const bucketName = process.env.S3_BUCKET;

export const getAverageData = async (req, res) => {
    try {
        const data = await s3.getObject({
            Bucket: bucketName,
            Key: 'processed/avg_result.json'
        }).promise();

        const jsonData = JSON.parse(data.Body.toString());
        res.json(jsonData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch average data" });
    }
};
