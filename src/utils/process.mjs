import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../..', '.env') });

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const bucketName = process.env.S3_BUCKET;
const avgResultKey = 'processed/avg_result.json';

const listAndProcess = async () => {
    const { Contents } = await s3.listObjectsV2({ Bucket: bucketName, Prefix: 'sensor/' }).promise();

    let allData = [];
    for (const obj of Contents) {
        const data = await s3.getObject({ Bucket: bucketName, Key: obj.Key }).promise();
        const json = JSON.parse(data.Body.toString());
        allData.push(...json);
    }

    // Compute average
    if (allData.length === 0) {
        console.log("No data found.");
        return;
    }

    const avgTemp = (allData.reduce((sum, item) => sum + parseFloat(item.temperature), 0) / allData.length).toFixed(2);
    const avgPressure = (allData.reduce((sum, item) => sum + parseFloat(item.pressure), 0) / allData.length).toFixed(2);
    const timestamp = new Date(now - i * 60000).toISOString();

    const newEntry = {
        timestamp,
        averageTemperature: avgTemp,
        averagePressure: avgPressure
    };

    let existingData = [];

    try {
        const existingFile = await s3.getObject({ Bucket: bucketName, Key: avgResultKey }).promise();
        const parsed = JSON.parse(existingFile.Body.toString());
        
        if (Array.isArray(parsed)) {
            existingData = parsed; 
        } else if (typeof parsed === 'object' && parsed !== null) {
            existingData = [parsed];
        } else {
            existingData = [];
        }
    } catch (err) {
        if (err.code !== 'NoSuchKey') {
            console.error("Error fetching existing avg_result.json:", err);
            return;
        }
    }

    existingData.push(newEntry);

    await s3.putObject({
        Bucket: bucketName,
        Key: avgResultKey,
        Body: JSON.stringify(existingData, null, 2),
        ContentType: "application/json"
    }).promise();

    console.log("Appended new data to avg_result.json in S3");
};

listAndProcess().catch(console.error);
