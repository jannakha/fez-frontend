// import s3 from 'aws-sdk/clients/s3';

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property

export function putS3(apiUrl, data, options) {
    // 0: "https://uql-fez-staging-cache.s3.ap-southeast-2.amazonaws.com/uploader/UQ%3Ac66288c/Test.png
    // ?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD
    // &X-Amz-Algorithm=AWS4-HMAC-SHA256
    // &X-Amz-Credential=AKIAJJOXWW7HFQ7CDC2Q%2F20190404%2Fap-southeast-2%2Fs3%2Faws4_request
    // &X-Amz-Date=20190404T032800Z
    // &X-Amz-SignedHeaders=host
    // &X-Amz-Expires=600
    // &X-Amz-Signature=ea4d923b4cc34b9f15be4fb1b18f82c81f1752f5a5248536f4f724e2ef6cc951"

    const url = 'https://something.somewhere.place/path/to/resource.html?key1=value1&key2=value%20';

    const components = url.split('?');
    const queryString = components.pop();
    const fileName = components.pop();

    const paramPairs = queryString.split('&');

    let paramArray = [];

    for (const paramPair of paramPairs) {
        param = paramPair.split('=');
        paramArray.push({
            key: paramPair[0],
            value: paramPair[1]
        });
    }

    const params = {
        ACL: 'public-read',
        Bucket: fileName,
        Key: s3key,
        Body: data,
    };

    console.log('PARAMETERS FOR UPLOAD: ', params);
    console.log('OPTIONS FOR UPLOAD: ', options);

    // return s3.upload(params, options, (err, data) => {console.log(err, data);});
    return {};
}
