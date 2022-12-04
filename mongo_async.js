// @ts-check
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  'mongodb+srv://j:2134@cluster0.fervjll.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function main() {
  await client.connect();

  const user = client.db('kdt4').collection('user');

  const deleteResult = await user.deleteMany({});

  if (!deleteResult.acknowledged) throw new Error('삭제 이상');

  const insertResult = await user.insertMany([
    {
      name: 'pororo',
      age: 5,
    },
    {
      name: 'loopy',
      age: 6,
    },
    {
      name: 'crong',
      age: 4,
    },
  ]);

  if (!insertResult.acknowledged) throw new Error('삽입 이상');

  // const data = await user.findOne({ name: 'loopy' });
  // console.log(data);

  const data = await user.find({ age: { $gte: 5 } }).toArray(); // find await 걸리지 않음
  console.log(data);

  client.close();
}

main(); // async, await의 경우 함수 정의 후 실행 반드시 필요
