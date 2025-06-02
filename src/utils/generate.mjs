import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../..', '.env') });

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const bucketName = process.env.S3_BUCKET;

const generateData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 10; i++) {
        data.push({
            id: uuidv4(),
            timestamp: new Date(now - i * 60000).toISOString(),
            temperature: (Math.random() * 35 + 10).toFixed(2), 
            pressure: (Math.random() * 70 + 980).toFixed(2)     

        });
    }
    return data;
};

const uploadData = async () => {
    const data = generateData();
    const jsonContent = JSON.stringify(data, null, 2);
    const fileName = `sensor_data_${Date.now()}.json`;

    await s3.putObject({
        Bucket: bucketName,
        Key: `sensor/${fileName}`,
        Body: jsonContent,
        ContentType: "application/json"
    }).promise();

    console.log(`Uploaded ${fileName} to S3`);
};

uploadData().catch(console.error);
