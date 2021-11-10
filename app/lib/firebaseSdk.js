import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from "@react-native-firebase/database";
import storage from '@react-native-firebase/storage';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import appleAuth from '@invertase/react-native-apple-authentication';

import NetInfo from '@react-native-community/netinfo';
import messaging from "@react-native-firebase/messaging";
import random from '../utils/random';
import I18n from '../i18n';
import {CLOUD_URL, NAIL_TYPE_LOVER} from '../constants/app';
import RNFetchBlob from 'rn-fetch-blob';
import {isAndroid, isIOS} from '../utils/deviceInfo';

const CLOUD_MESSAGING_SERVER_KEY = 'AAAAvdlalxY:APA91bGAyphq5cOJv4ARNYI1lMG_4ag-73weHGc8Q8W2rWkG41yE9CLY0sYi-BH3kQC9jNy1Ghfrv6s6CDe8uiXVHYaKvAI6Km3UV1n_quckaoobg_RB-IY5fFoopK_72154VjZufnFz';
const GOOGLE_SIGN_IN_WEBCLIENT_ID = isIOS?'815395411734-ncukrhme0jqm5a15fuf4s405qvqlts2m.apps.googleusercontent.com':'815395411734-0vpujn7otc5tmcun9l556r76g1prh7b6.apps.googleusercontent.com';

GoogleSignin.configure({
    webClientId: GOOGLE_SIGN_IN_WEBCLIENT_ID
})

export const DB_ACTION_ADD = 'add';
export const DB_ACTION_UPDATE = 'update';
export const DB_ACTION_DELETE = 'delete';

export const NOTIFICATION_TYPE_FOLLOW = 0;
export const NOTIFICATION_TYPE_LIKE = 1;
export const NOTIFICATION_TYPE_CHAT = 2;
export const NOTIFICATION_TYPE_COMMENT = 3;

export const ORDER_STATUS_PENDING = 0;
export const ORDER_STATUS_PAID = 1;
export const ORDER_STATUS_SHIPPING = 2;
export const ORDER_STATUS_COMPLETE = 3;
export const ORDER_STATUS_REFUND = 5;
export const ORDER_STATUS_CANCEL = 9;

export const MAIL_TYPE_CREATE_ORDER = 'create_order';
export const MAIL_TYPE_SHIPPING_ORDER = 'shipping_order';
export const MAIL_TYPE_COMPLETE_ORDER = 'complete_order';
export const MAIL_TYPE_CANCEL_ORDER = 'cancel_order';

let unReadSubscribe = null;

const firebaseSdk = {
    TBL_USER : "User",
    TBL_POST : "Post",
    TBL_REPORTS : "Reports",
    TBL_ROOM : "Room",
    TBL_MESSAGE : "Message",
    TBL_ACTIVITY : "Activities",
    TBL_PRODUCTS: "Products",
    TBL_ORDER: 'Orders',
    TBL_OPTIONS: "Options",

    OPTION_HEADER_ITEMS: "shop_header_items",
    OPTION_SHIPPING_CHARGES: "shipping_charges",
    OPTION_TAX: "tax",

    STORAGE_TYPE_AVATAR: "avatar",
    STORAGE_TYPE_PHOTO: "photo",

    async checkInternet(){
        return NetInfo.fetch().then(state => {
            return state.isConnected;
        })
    },

    async authorizedUser(){
        try{
            if(!auth().currentUser) return null;
            await auth().currentUser.reload();
            return auth().currentUser;
        } catch (e){
            return null;
        }
    },

    signInWithEmail(email, password) {
        return new Promise((resolve, reject) => {
            auth().signInWithEmailAndPassword(email, password)
                .then((res) => {
                    this.getUser(res.user.uid)
                        .then((user) => {
                            resolve({...user, emailVerified: res.user.emailVerified});
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err.message);
                });
        })
    },

    reauthenticate(email, password){
        let user = firebase.auth().currentUser;
        let cred = auth.EmailAuthProvider.credential(email, password);
        return user.reauthenticateWithCredential(cred);
    },

    updateCredential(email, password){
        return new Promise(async (resolve, reject) => {
            try {
                let user = firebase.auth().currentUser;
                await user.updateEmail(email);
                await user.updatePassword(password);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    },

    appleSignIn(){
        return new Promise(async (resolve, reject) => {
            try {
                // Start the sign-in request
                const appleAuthRequestResponse = await appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
                });

                // Ensure Apple returned a user identityToken
                if (!appleAuthRequestResponse.identityToken) {
                    throw 'Apple Sign-In failed - no identify token returned';
                }

                // Create a Firebase credential from the response
                const {identityToken, nonce} = appleAuthRequestResponse;
                const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

                // Sign the user in with the credential
                resolve(auth().signInWithCredential(appleCredential));
            } catch (err) {
                reject(err);
            }
        })
    },

    googleSignIn(){
        return new Promise(async (resolve, reject) => {
            try {
                // Get the users ID token
                const {idToken} = await GoogleSignin.signIn();

                // // Create a Google credential with the token
                const googleCredential = auth.GoogleAuthProvider.credential(idToken);

                // // Sign-in the user with the credential
                resolve(auth().signInWithCredential(googleCredential));
            } catch (err) {
                reject(err);
            }
        })
    },


    facebookSignIn(){
        return new Promise(async (resolve, reject) => {
            try {
                const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

                if (result.isCancelled) {
                    throw 'User cancelled the login process';
                }

                // Once signed in, get the users AccesToken
                const data = await AccessToken.getCurrentAccessToken();

                if (!data) {
                    throw 'Something went wrong obtaining access token';
                }

                // Create a Firebase credential with the AccessToken
                const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

                // Sign-in the user with the credential
                resolve(auth().signInWithCredential(facebookCredential));
            } catch (err) {
                reject(err);
            }
        })
    },


    socialLogin(socialCredential){
        return new Promise(async (resolve, reject) => {
            const userInfos = await firebase.firestore().collection(this.TBL_USER).get();
            let userInfo = null;
            userInfos.forEach(doc => {
                if (doc.data().userId === socialCredential.uid) {
                    userInfo = doc.data();
                }
            });
            console.log('userInfo', userInfo);
            if(userInfo){
                resolve({
                    ...userInfo,
                    emailVerified: true
                });
            } else {
                userInfo = {
                    userId: socialCredential.uid,
                    displayName: `${socialCredential.firstName} ${socialCredential.lastName}`,
                    email: socialCredential.email,
                    avatar: socialCredential.avatar,
                    salon_name: '',
                    address: '',
                    phone: '',
                    type: NAIL_TYPE_LOVER,
                    salon_instagram_account: '',
                    followings: [],
                    followers: [],
                    blocked: [],
                    createdAt: new Date()
                }
                const userDoc = await firestore().collection(this.TBL_USER).add(userInfo);
                resolve({
                    id: userDoc.id,
                    ...userInfo,
                    emailVerified: true
                });
            }
        });
    },

    resetPassword(email){
        return new Promise((resolve, reject) => {
            auth().sendPasswordResetEmail(email)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err.code);
                })
        })
    },

    signUp(user){
        return new Promise((resolve, reject) => {
            const {email, password} = user;
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    const userInfo = {
                        userId: res.user.uid,
                        displayName: user.displayName,
                        salon_name: user.salon_name,
                        address: user.address,
                        phone: user.phone,
                        email: user.email,
                        type: user.type,
                        salon_instagram_account: user.salon_instagram_account,
                        followings: [],
                        followers: [],
                        blocked: [],
                        createdAt: new Date()
                    };

                    res.user.sendEmailVerification();

                    this.createUser(userInfo).then(() => {
                        resolve(userInfo);
                    }).catch((err) => {
                        console.log('error', err);
                        reject(err);
                    });

                })
                .catch((err) => {
                    console.log('error', err);
                    reject(err);
                });
        })
    },

    unSubscribe(){
        console.log('unSubscribe', unReadSubscribe);
        if(unReadSubscribe){
            console.log('unSubscribe run');
            unReadSubscribe();
            unReadSubscribe = null;
        }
    },

    signOut(){
        return new Promise((resolve, reject) => {
            auth().signOut().then((res) => resolve(res)).catch(err => reject(err));
        });
    },

    createUser(userInfo){
        return new Promise((resolve, reject) => {
            firestore()
                .collection(this.TBL_USER)
                .add(userInfo)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                })
        })
    },

    deleteUser(id){
        return new Promise((resolve, reject) => {
            firestore()
                .collection(this.TBL_USER)
                .doc(id)
                .delete()
                .then(() => {
                    console.log('delete user on doc success');
                })
                .catch((err) => {
                    console.log('delete user on doc error', err)
                });

            auth().currentUser.delete()
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err)
                });
        })
    },

    getUser(id){
        return new Promise((resolve, reject) => {
            firebase.firestore()
                .collection(this.TBL_USER)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        if (doc.data().userId === id) {
                            const user = {
                                id: doc.id,
                                ...doc.data()
                            }
                            resolve(user);
                        }
                    })
                    resolve('no exist');
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    getUserSocialRegistered(email){
        return new Promise((resolve, reject) => {
            firebase.firestore()
                .collection(this.TBL_USER)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        if (doc.data().email == email) {
                            resolve(doc.data());
                        }
                    })
                    resolve('no exist');
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    getData(kind = ''){
        return new Promise((resolve, reject) => {
            firebase.firestore()
                .collection(kind)
                .get()
                .then(snapshot => {
                    var data = [];
                    snapshot.forEach(doc => {
                        var obj = doc.data();
                        Object.assign(obj, {id: doc.id});
                        data.push(obj);
                    })
                    console.log('getData : ' + kind + ' Data: ', data);
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },

    setData(kind = '', act, item){
        return new Promise((resolve, reject) => {
            if (act === DB_ACTION_ADD) {
                firebase.firestore()
                    .collection(kind)
                    .add(item)
                    .then((res) => {
                        let itemWithID = {...item, id: res.id};
                        firebase.firestore()
                            .collection(kind)
                            .doc(res.id)
                            .update(itemWithID)
                            .then((response) => {
                                resolve(itemWithID)
                            })
                            .catch((err) => {
                                reject(err);
                            })
                    })
                    .catch(err => {
                        reject(err);
                    })
            } else if (act === DB_ACTION_UPDATE) {
                firebase.firestore()
                    .collection(kind)
                    .doc(item.id)
                    .update(item)
                    .then(() => {
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    })
            } else if (act === DB_ACTION_DELETE) {
                firebase.firestore()
                    .collection(kind)
                    .doc(item.id)
                    .delete()
                    .then(() => {
                        console.log(kind, act)
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    })
            }
        })
    },

    getOptionData(kind){
        return new Promise(async (resolve, reject) => {
            firebase.firestore()
                .collection(firebaseSdk.TBL_OPTIONS)
                .doc(kind)
                .get()
                .then(snapshot => {
                    const data = snapshot.data();
                    resolve(data);
                })
                .cancel(err => {
                    reject(err);
                })
        });
    },

    setOptionData(kind, data){
        return new Promise(async (resolve, reject) => {
            firebase.firestore()
                .collection(firebaseSdk.TBL_OPTIONS)
                .doc(kind)
                .set(data)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })
        })
    },

    updateFollows(myId, accountId, action){
        return new Promise(async (resolve, reject) => {
            const db = firebase.firestore();
            const myRef = db.collection(firebaseSdk.TBL_USER).doc(myId);
            const userRef = db.collection(firebaseSdk.TBL_USER).doc(accountId);
            try {
                await db.runTransaction(async (t) => {
                    const myDoc = await t.get(myRef);
                    const userDoc = await t.get(userRef);

                    let myFollowings = myDoc.data().followings;
                    let userFollowers = userDoc.data().followers;
                    if(action === DB_ACTION_ADD){
                        myFollowings = [...myFollowings, userDoc.data().userId];
                        userFollowers = [...userFollowers, myDoc.data().userId];
                    } else {
                        myFollowings = myFollowings.filter(f => f!== userDoc.data().userId);
                        userFollowers = userFollowers.filter(f => f!== myDoc.data().userId);
                    }

                    t.update(myRef, {followings: myFollowings});
                    t.update(userRef, {followers: userFollowers});
                    resolve({myFollowings, userFollowers});
                });
            } catch (e) {
                reject(e);
            }
        });
    },

    uploadMedia(type, path){
        const milliSeconds = new Date().getMilliseconds();
        return new Promise((resolve, reject) => {

            let ref = storage().ref(`${type}_${milliSeconds}`);

            ref.putFile(path)
                .then(async (res) => {
                    const downloadURL = await ref.getDownloadURL();
                    resolve(downloadURL);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    },

    async saveMessage(roomId, message, sender, receiver){
        const statusRef = database().ref('rooms/' + roomId + '/status/' + message.receiver);
        const status = (await statusRef.once('value')).val();
        console.log('chatter status', status);
        if(!status || status === 'offline'){

            const roomData = (await firebase.firestore().collection(this.TBL_ROOM).doc(roomId).get()).data();
            let unReads = roomData.unReads + 1;
            if(roomData.confirmUser !== receiver.userId){
                unReads = 1;
            }
            await firebase.firestore().collection(this.TBL_ROOM).doc(roomId).update({lastMessage: message.message, confirmUser: message.receiver, unReads: unReads, date: new Date()});

            if(receiver.token) {
                this.sendNotifications([receiver.token], {
                    type: NOTIFICATION_TYPE_CHAT,
                    title: receiver.displayName,
                    message: I18n.t('Sent_message_to_you', {name: sender.displayName, message: message.message}),
                    sender: message.sender,
                    receiver: message.receiver,
                    date: new Date(),
                    meetupId: ""
                })
            }
        } else {
            await firebase.firestore().collection(this.TBL_ROOM).doc(roomId).update({lastMessage: message.message, confirmUser: message.receiver, date: new Date()});
        }

        return await firebase.firestore().collection(this.TBL_MESSAGE).add(message);
    },

    async getUnReads(userId, resolve){
        if(unReadSubscribe){
            unReadSubscribe();
        }
        let queryRef = await firebase.firestore()
            .collection(this.TBL_ROOM)
            .where('confirmUser', '==', userId);

        unReadSubscribe = queryRef.onSnapshot((roomSnap) => {
                let allUnReads = 0;
                roomSnap.forEach(r => {
                    const roomInfo = r.data();
                    if (roomInfo.unReads > 0) {
                        allUnReads += roomInfo.unReads;
                    }
                })
                console.log('unreads', allUnReads);
                resolve(allUnReads);
            })
        console.log('subscribe', unReadSubscribe);
    },

    onOnline(roomId, userId){
        const statusRef = database().ref('rooms/' + roomId + '/status/' + userId);
        statusRef.set('online');
        statusRef.onDisconnect().set('offline').then(() => {}).catch(() => {});
    },

    onOffline(roomId, userId){
        const statusRef = database().ref('rooms/' + roomId + '/status/' + userId);
        statusRef.set('offline');
    },

    typing(roomId, userId, typing){
        const typingRef = database().ref('rooms/' + roomId + '/typing/' + userId);
        typingRef.set(typing);
        typingRef.onDisconnect().set(false).then(() => {}).catch(() => {});
    },

    addActivity(notification, token){
        return new Promise((resolve, reject) => {
            firestore()
                .collection(this.TBL_ACTIVITY)
                .add(notification)
                .then(() => {
                    if(token){
                        this.sendNotifications([token], notification);
                    }
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                })
        })
    },

    async setFcmToken(userId){
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log("Your Firebase Token is:", fcmToken);
                this.setData(this.TBL_USER, DB_ACTION_UPDATE, {id: userId, token: fcmToken});
                return;
            }
        }
        console.log("Failed", "No token received");
        return null
    },

    sendNotifications(tokens, data){
        for (let i = 0; i < tokens.length; i++) {
            let params = {};
            if(isAndroid){
                params = {
                    to: tokens[i],
                    data
                };
            } else {
                params = {
                    to: tokens[i],
                    notification: {
                        title: data.title,
                        body: data.message
                    },
                    priority: 'high',
                    data
                };
            }

            let options = {
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                    'Authorization': `key=${CLOUD_MESSAGING_SERVER_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            };
            console.log('send notification: ', options);
            try {
                fetch('https://fcm.googleapis.com/fcm/send', options);
            } catch (e) {
                console.log('Send Notification Error:', e);
            }
        }
        return true;
    },

    createPaymentIntent(price){
        return new Promise(async (resolve, reject) => {
            const apiUrl = `${CLOUD_URL}/createPaymentIntent?amount=${price}`;
            console.log('API CALL', apiUrl);

            const paymentIntent =
                await RNFetchBlob.fetch('GET', apiUrl)
                    .then(response => {
                        return response.json();
                    })
                    .catch(e => {
                        return null;
                    })

            console.log('paymentIntent', paymentIntent);
            if(!paymentIntent){
                reject('api call failed');
            }
            resolve(paymentIntent);
        });
    },

    updateUserPayment(user_id, updates){
        return new Promise((resolve, reject) => {
            this.setData(this.TBL_USER, DB_ACTION_UPDATE, updates).then(async () => {

                const apiUrl = `${CLOUD_URL}/createCustomer?user_id=${user_id}`;
                console.log('API CALL', apiUrl);

                const customer =
                    await RNFetchBlob.fetch('GET', apiUrl)
                        .then(response => {
                            return response.json();
                        })
                        .catch(e => {
                            return null;
                        })

                console.log('customer', customer);
                if (!customer) {
                    reject('api call failed');
                    return;
                }
                resolve(customer);
            }).catch(err => {
                reject(err);
            })
        });
    },

    sendMail(order_id, type){
        return new Promise(async (resolve, reject) => {
            const apiUrl = `${CLOUD_URL}/sendMail?order_id=${order_id}&type=${type}`;
            console.log('API CALL', apiUrl);

            const result = await RNFetchBlob.fetch('GET', apiUrl)
                .then(response => {
                    return response.json();
                })
                .catch(e => {
                    console.log('send CreateOrderMail Error', e);
                    return null;
                })
            if(!result){
                reject('send mail failed');
            }
            console.log('send createOrderMail success', result);
            resolve(result);
        });
    }
}

export default firebaseSdk;
