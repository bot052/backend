// @ts-check
const express = require('express');

const router = express.Router(); // 파일 내부에만 존재하므로 router 겹쳐도 괜찮음

const POSTS = [
  {
    title: 'title01',
    content: '가나다라마바사',
  },
  {
    title: 'title02',
    content: 'abcdefg',
  },
];

// localhost:4000/posts
// posts 서비스 페이지
router.get('/', (req, res) => {
  res.render('posts', { POSTS, postCounts: POSTS.length });
});

// localhost:4000/posts/list
// 전체 포스트 목록 보여주기
router.get('/list', (req, res) => {
  res.send(POSTS);
});

// localhost:4000/posts/
// 새로운 포스트 등록
router.post('/', (req, res) => {
  if (req.body) {
    if (req.body.title && req.body.content) {
      const newPost = {
        title: req.body.title,
        content: req.body.content,
      };
      POSTS.push(newPost);
      res.redirect('/posts');
    } else {
      const err = new Error('Missing data');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('No data');
    err.statusCode = 404;
    throw err;
  }
});

// 포스트 삭제 API
router.delete('/:title', (req, res) => {
  const findPostIndex = POSTS.findIndex(
    (posts) => posts.title === req.params.title
  );
  if (findPostIndex !== -1) {
    POSTS.splice(findPostIndex, 1);
    res.send('포스트 삭제 완료');
  } else {
    const err = new Error('해당 제목을 가진 포스트를 찾을 수 없습니다');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
