// @ts-check

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('dotenv').config();

const app = express();
const { PORT } = process.env;

// 외부 모듈 import
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const boardRouter = require('./routes/board');
const dataRouter = require('./routes/data');
const dbBoardRouter = require('./routes/dbBoard');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');

// ejs 세팅
app.set('view engine', 'ejs');

app.use(cookieParser('j'));
app.use(
  session({
    secret: 'j',
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(express.static('public'));
app.use(bodyParser.json()); // express모듈에 존재하므로 express 모듈로 전환 가능
app.use(bodyParser.urlencoded({ extended: false })); // 필수 옵션

// 라우터 파일 연결 처리하여 열기
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/board', boardRouter); // board주소 들어올시 boardRouter가 실행
app.use('/data', dataRouter);
app.use('/dbBoard', dbBoardRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500); // 우리가 만든 코드로 발견되지 않으면 서버에러인 500번을 띄움
  res.send(err.message);
});

// 서버구동
app.listen(PORT, () => {
  console.log(`서버는 ${PORT}번에서 실행 중입니다!`);
});
