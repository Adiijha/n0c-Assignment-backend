import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
    region: process.env.AWS_REGION
});
const bucketName = process.env.S3_BUCKET;

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
    const result = {
        timestamp: new Date().toISOString(),
        averageTemperature: avgTemp,
        averagePressure: avgPressure
    };

    await s3.putObject({
        Bucket: bucketName,
        Key: `processed/avg_result.json`,
        Body: JSON.stringify(result, null, 2),
        ContentType: "application/json"
    }).promise();

    console.log("Processed data uploaded to S3");
};

listAndProcess().catch(console.error);
