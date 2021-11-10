import { takeLatest, put, select } from 'redux-saga/effects';
import { CHAT } from '../actions/actionsTypes';
import firebaseSdk from "../lib/firebaseSdk";
import {setUnread} from '../actions/chat';
import store from '../lib/createStore';

const fetchUnread = function* fetchUnread() {
	const user = yield select(state => state.login.user);
	firebaseSdk.getUnReads(user.userId,  (unReads) => {
		store.dispatch(setUnread(unReads));
	});
};

const root = function* root() {
	yield takeLatest(CHAT.FETCH_UNREAD, fetchUnread);
};
export default root;
