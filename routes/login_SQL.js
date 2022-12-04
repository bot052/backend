// @ts-check

const express = require('express');
const db = require('../controllers/userController');

const router = express.Router();

// 회원 가입 페이지
router.get('/', (req, res) => {
  res.render('login');
});

// 로그인 처리
router.post('/', (req, res) => {
  db.userCheck(req.body.id, (data) => {
    if (data.length > 0) {
      if (data[0].PASSWORD === req.body.password) {
        req.session.login = true;
        req.session.userId = req.body.id;

        // 쿠키 발행
        res.cookie('user', req.body.id, {
          maxAge: 1000 * 20,
          httpOnly: true,
          signed: true, // 쿠키 암호화 처리
        });

        res.redirect('/dbBoard');
      } else {
        res.status(400);
        res.send(
          '비밀번호가 다릅니다.<br><a href="/login">로그인으로 이동</a>',
        );
      }
    } else {
      res.status(400);
      res.send(
        '회원 ID를 찾을 수 없습니다..<br><a href="/login">로그인으로 이동</a>',
      );
    }
  });
});

// 로그아웃 처리
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie('user');
    res.redirect('/');
  });
});

module.exports = router;
