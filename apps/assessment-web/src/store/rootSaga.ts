import { all, takeLatest, put } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "./slices/authSlice";

function* handleLogin(action: any): Generator<any, void, any> {
  try {
    // Scaffold login logic
    yield put(
      loginSuccess({ username: action.payload.username, role: "user" }),
    );
  } catch (error: any) {
    yield put(loginFailure(error.message || "Login failed"));
  }
}

function* watchAuth() {
  yield takeLatest(loginRequest.type, handleLogin);
}

export default function* rootSaga() {
  yield all([watchAuth()]);
}
