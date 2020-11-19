const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/error');
const userRouter = require('./routes/user');
const matchRouter = require('./routes/match');
const battingRouter = require('./routes/batting');
// const { upcoming } = require('./api/upcoming');
const schedule = require('node-schedule');

const connectDB = require('./config/db');
const {
  bringThreeDayLaterMatchs,
  bringMatchFromAPI,
} = require('./api/bringNewMatchs');
const { dummyDatas } = require('./utils/dummy');
const {
  bringFinishedDataAndEditMatch,
  getTodaysMatchs,
  putResultToMatch,
  reservePutResultToMatch,
  putResultToBattingAndUserTest,
} = require('./api/setResultToMatch');
const { checkTime } = require('./middlewares/battingRestriction');

//require('dotenv').config(); // .env -> 중요정보 보호. (gitignore 해둬서 git에는 안감.)
// 밑에껄로 바꿀게요 !
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

connectDB();

// ! 한번 하고 주석 처리 !
// dummyDatas();

const app = express();

app.use(morgan('dev')); // 로그 찍어줌

// 접근 제어
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// api를 위한 라우터들
app.use('/api/user', userRouter);
app.use('/api/match', matchRouter);
app.use('/api/batting', battingRouter);
app.get('/ping', (req, res, next) => {
  console.log(req.headers);
  res.status(200).json(null);
});

// const Match = require('./models/Match');
// const ab = async () => {
//   await Match.deleteMany({ })
// }

// bringMatchFromAPI('2790', '2020-10-24');
// console.log('가져왔엉');

// 미들웨어들
app.use(helmet()); // 코드 보호
app.use(express.json()); // form 데이터나 ajax 요청을 파싱해줌.

// it excute on 11am everyday.
// bringThreeDayLaterMatchs();
// it excute on everyday 00:01:00.
// reservePutResultToMatch();
// bringFinishedDataAndEditMatch("5f48e05e7d77d50fb0bd3ef4", 71);
// getTodaysMatchs();
// putResultToBattingAndUserTest()

app.use(errorHandler);

const port = process.env.PORT || 1337;
const server = app.listen(port, () => {
  console.log(`실행됨 : http://localhost:${port}`);
  // 모든 리그 아이디 써보기.
  // upcoming();
});

module.exports = app;
