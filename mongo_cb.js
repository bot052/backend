// @ts-check
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  'mongodb+srv://j:2134@cluster0.fervjll.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  // 에러를 뱉어주는 인자
  const user = client.db('kdt4').collection('user');

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
            user.updateMany(
              { age: { $gte: 5 } },
              { $set: { name: '5살 이상' } },
              (err, updateManyResult) => {
                if (updateManyResult?.acknowledged) {
                  const findCursor = user.find({}); // {}:모든데이터 를 찾아주기
                  findCursor.toArray((err, data) => {
                    console.log(data);
                    client.close();
                  });
                }
              },
            );
          }
        },
      );
    }
  });
});
