// @ts-check
const express = require('express');

const router = express.Router();

// 백엔드로 쿠키 발행
// router.get('/', (req, res) => {
//   res.cookie('name', '신주영', {
//     expires: new Date(Date.now() + 1000 * 10), // 10초 동안 존재
//     httpOnly: true,
//   });

//   const key = Object.keys(req.cookies)[1];

//   res.render('index', { key: key, value: req.cookies[key] }); // 백에서 값을 전달받아 사용하는 방법, ejs로 값 전달
// });

router.get('/', (req, res) => {
  res.render('index', { popup: req.cookies.popup }); // popup 데이터의 팝없 값 전달
});

router.post('/cookie', (req, res) => {
  res.cookie('popup', 'hide', {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.send('쿠키 생성 성공!');
});

router.get('/cookie', (req, res) => {
  res.cookie('cookie', true, {
    maxAge: 1000 * 60,
    httpOnly: false,
  });
  res.clearCookie('cookie');
  res.send('쿠키 굽기 성공!');
});

module.exports = router;
