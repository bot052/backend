// @ts-check

const connection = require('./dbConnect');

const db = {
  getUsers: (cb) => {
    connection.query('SELECT * FROM mydb.user;', (err, data) => {
      if (err) throw err;
      // console.log(data);
      cb(data);
    });
  },
  // 유저 중복 체크
  userCheck: (userId, cb) => {
    connection.query(
      `SELECT * FROM mydb.user WHERE USERID = '${userId}';`, // ''으로 꼭 처리, 없을시 column명으로 인식되므로
      (err, data) => {
        if (err) throw err;
        cb(data);
      },
    );
  },

  // 회원가입
  registerUser: (newUser, cb) => {
    connection.query(
      `INSERT INTO mydb.user (USERID, PASSWORD) VALUES ('${newUser.id}', '${newUser.password}');`,
      (err, data) => {
        if (err) throw err;
        cb(data);
      },
    );
  },
};

module.exports = db;
