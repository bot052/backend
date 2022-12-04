// @ts-check
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://j:2134@cluster0.fervjll.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err, db) => {
  const user = client.db('kdt-test').collection('test');

  user.deleteMany({}, (err, deleteResult) => {
    if (deleteResult?.acknowledged) {
      user.insertMany(
        [
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
        ],
        (err, insertResult) => {
          if (insertResult?.acknowledged) {
            const cursor = user.find({
              $or: [{ age: { $gte: 5 } }, { name: 'crong' }],
            }); // find 대상범위 넓으므로 두번 나누어서 실행한다고 생각하기

            cursor.toArray((err, data) => {
              console.log(data);
              client.close();
            });
          }
        }, // mongodb 형태 모두 객체형태로 {} 안에 입력
      );
    }
  });
});
