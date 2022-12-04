// @ts-check

const { errorMonitor } = require('events');
const express = require('express');
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
router.get('/', isLogin, (req, res) => {
  db.getAllArticles((data) => {
    console.log(data);
    const ARTICLE = data;
    const articleCounts = ARTICLE.length;
    res.render('dbBoard', {
      ARTICLE,
      articleCounts,
      userId: req.session.userId,
    }); // ejs파일 그려주기 / 배열, 개수 전달
  });
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
router.post('/write', isLogin, (req, res) => {
  if (req.body.title && req.body.content) {
    const newArticle = {
      id: req.session.userId,
      title: req.body.title,
      content: req.body.content,
    };
    db.writeArticle(newArticle, (data) => {
      if (data.protocol41) {
        res.redirect('/dbBoard');
      } else {
        const err = new Error('DB에 글 추가 실패');
        throw err;
      }
    });
  } else {
    const err = new Error('글 제목 또는 내용이 빠졌습니다.');
    throw err;
  }
});

// 게시글 수정 페이지로 이동
router.get('/modify/:id', isLogin, (req, res) => {
  db.getArticle(req.params.id, (data) => {
    console.log(data);
    if (data.length > 0) {
      res.render('dbBoard_modify', { selectedArticle: data[0] }); // 배열로 전달
    }
  });
});

// 게시글 수정
router.post('/modify/:id', isLogin, (req, res) => {
  if (req.body.title && req.body.content) {
    db.modifyArticle(req.params.id, req.body, (data) => {
      if (data.protocol41) {
        res.redirect('/dbBoard');
      } else {
        const err = new Error('글 제목 또는 내용이 빠졌습니다.');
        throw err;
      }
    });
  }
});

// 게시글 삭제
router.delete('/delete/:id', isLogin, (req, res) => {
  if (req.params.id) {
    db.deleteArticle(req.params.id, (data) => {
      console.log(data);
      if (data.protocol41) {
        res.send('삭제 완료');
      } else {
        const err = new Error('글 삭제 실패');
        err.statusCode = 404;
        throw err;
      }
    });
  } else {
    const err = new Error('ID 파라미터 값이 없습니다');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
