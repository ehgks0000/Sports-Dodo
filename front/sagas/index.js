import { all, call } from "redux-saga/effects"
import userSaga from "./user"
import axios from "axios"
import { BACKEND_URL } from "../src/dummy.js"

axios.defaults.baseURL = `${BACKEND_URL}/api`

export default function* rootSaga() {
  yield all([call(userSaga)])
}
