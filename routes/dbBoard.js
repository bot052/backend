// @ts-check

const { errorMonitor } = require('events');
const express = require('express');
const { write } = require('fs');
const { request } = require('http');
const db = require('../controllers/boardController');

const router = express.Router();

// 로그인 처리 함수
function isLogin(req, res, next) {
  if (req.session.login || req.signedCookies.user) {
    next();
  } else {
    res.status(400);
    res.send(
      '로그인이 필요한 서비스 입니다.<br><a href="/login">로그인 페이지로 이동</a>',
    );
  }
}

// dbBoard 메인 페이지
// localhost:4000/dbBoard
router.get('/', isLogin, async (req, res) => {
  const ARTICLE = await db.getAllArticles();
  const articleCounts = ARTICLE.length;
  res.render('dbBoard', {
    ARTICLE,
    articleCounts,
    userId: req.session.userId,
  }); // ejs파일 그려주기 / 배열, 개수 전달
});

// 모든 게시글 데이터를 받아오는 라우터
router.get('/getAll', (req, res) => {
  db.getAllArticles((data) => {
    res.send(data);
  });
});

// 게시글 쓰기 페이지 이동
router.get('/write', isLogin, (req, res) => {
  res.render('dbBoard_write');
});

// 게시글 추가
router.post('/write', isLogin, async (req, res) => {
  if (req.body.title && req.body.content) {
    const newArticle = {
      USERID: req.session.userId,
      TITLE: req.body.title,
      CONTENT: req.body.content,
    };

    const writeResult = await db.writeArticle(newArticle);
    if (writeResult) {
      res.redirect('/dbBoard');
    } else {
      const err = new Error('DB에 글 추가 실패');
      throw err;
    }
  } else {
    const err = new Error('글 제목 또는 내용이 빠졌습니다.');
    throw err;
  }
});

// 게시글 수정 페이지로 이동
router.get('/modify/:id', isLogin, async (req, res) => {
  const findArticle = await db.getArticle(req.params.id);
  console.log('11', findArticle);
  if (findArticle) {
    res.render('dbBoard_modify', { selectedArticle: findArticle });
  }
});

// 게시글 수정
router.post('/modify/:id', isLogin, async (req, res) => {
  if (req.body.title && req.body.content) {
    const modifyResult = await db.modifyArticle(req.params.id, req.body);
    if (modifyResult) {
      res.redirect('/dbBoard');
    } else {
      const err = new Error('글 제목 또는 내용이 빠졌습니다.');
      throw err;
    }
  } else {
    const err = new Error('글 제목 또는 내용이 빠졌습니다.');
    throw err;
  }
});

// 게시글 삭제
router.delete('/delete/:id', isLogin, async (req, res) => {
  if (req.params.id) {
    const deleteResult = await db.deleteArticle(req.params.id);
    if (deleteResult) {
      res.send('삭제 완료');
    } else {
      const err = new Error('글 삭제 실패');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('ID 파라미터 값이 없습니다');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
