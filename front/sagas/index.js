import { all, call } from 'redux-saga/effects';
import userSaga from './user';
import battingSaga from './batting';
import rankingSaga from './ranking';
import matchSaga from './match';
import axios from 'axios';
// import { BACKEND_URL } from '../src/dummy.js';

//배포 시 백엔드
// export const BACKEND_URL = 'https://sports-dodo.herokuapp.com';
// 테스트시 백엔드
export const BACKEND_URL = 'http://localhost:1337';

axios.defaults.baseURL = `${BACKEND_URL}/api`;

export default function* rootSaga() {
  yield all([
    call(matchSaga),
    call(userSaga),
    call(battingSaga),
    call(rankingSaga),
  ]);
}
