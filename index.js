const sdk = require('aws-sdk')
const uuid = require('uuid')

const kinesis = new sdk.Kinesis({region: 'us-east-1'});
const id = uuid.v4()
const stream = 'kinesis_test'

async function go() {
    const response = await kinesis.putRecord({
        StreamName: stream,
        PartitionKey: id,
        Data: JSON.stringify({
            id,
            message: `Kinesis Record Produced`
        })
    }).promise();


    console.log(response);


    const { StreamDescription } = await kinesis.describeStream({
        StreamName: stream,
    }).promise();

    const { ShardIterator } = await kinesis.getShardIterator({
        StreamName: stream,
        ShardId: StreamDescription.Shards[0].ShardId,
        ShardIteratorType: 'TRIM_HORIZON'
    }).promise();

    const getResponse = await kinesis.getRecords({
        ShardIterator,
        Limit: 100
    }).promise();

    console.log(getResponse);
}

go();