// @ts-check
const express = require('express');

const router = express.Router();

const USER = [
  {
    id: 'tetz',
    name: '이효석',
    email: 'tetz@naver.com',
  },
  {
    id: 'kimi',
    name: '이기원',
    email: 'kimi@naver.com',
  },
];

// EJS 사용 파트
// localhost:4000/users 로 처리
// 가장 먼저 들어가는 미들웨어로 코드 최상단으로 올리는 것이 좋음
router.get('/', (req, res) => {
  res.render('users', { USER, userCounts: USER.length });
});

// 유저 라우터, 전체 회원 목록 조회
// localhost:4000/users/list
router.get('/list', (req, res) => {
  res.send(USER);
});

// 특정 ID를 가진 회원 정보 조회
// 에러 띄우기
router.get('/id/:id', (req, res) => {
  const findUser = USER.find((user) => {
    console.log(user);
    return user.id === req.params.id;
  });
  if (findUser) {
    res.send(findUser);
  } else {
    const err = new Error('ID를 찾을 수 없습니다.');
    throw err;
  }
});

// 새로운 회원 등록 작업 => email작업필요
router.post('/', (req, res) => {
  // 쿼리, body로 요청해도 회원등록 가능
  if (Object.keys(req.query).length > 0) {
    if (req.query.id && req.query.name && req.query.email) {
      const newUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };
      USER.push(newUser);
      res.send('회원 등록 완료!');
    } else {
      const err = new Error('Unexpected Query!');
      err.statusCode = 404;
      throw err;
    }
  } else if (req.body) {
    if (req.body.id && req.body.name && req.body.email) {
      const newUser = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
      };
      USER.push(newUser);
      res.redirect('/users');
    } else {
      const err = new Error('Unexpected Query!');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('No data');
    err.statusCode = 404;
    throw err;
  }
});

// 회원 수정을 하는 API => 작업필요
router.put('/:id', (req, res) => {
  if (req.query.id && req.query.name && req.query.email) {
    const findUserIndex = USER.findIndex((user) => user.id === req.params.id);
    if (findUserIndex !== -1) {
      const modifyUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };
      USER[findUserIndex] = modifyUser;
      res.send('회원 정보 수정 완료!');
    } else {
      const err = new Error('해당 ID를 찾을 수 없습니다!');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('Unexpected Query!');
    err.statusCode = 404;
    throw err;
  }
});

// 회원 삭제 API
router.delete('/:id', (req, res) => {
  const findUserIndex = USER.findIndex((user) => user.id === req.params.id);
  if (findUserIndex !== -1) {
    USER.splice(findUserIndex, 1);
    res.send('회원 삭제 완료');
  } else {
    const err = new Error('해당 ID를 찾을 수 없습니다');
    err.statusCode = 404;
    throw err;
  }
});

// // 동적 웹 그리기 미들웨어
// router.get('/show', (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
//   res.write('<h1>Hello, Dynamic Web page!</h1>');
//   for (let i = 0; i < USER.length; i++) {
//     res.write(`<h2>USER id is ${USER[i].id}`);
//     res.write(`<h2>USER name is ${USER[i].name}`);
//   }
//   res.end();
// });

module.exports = router;
