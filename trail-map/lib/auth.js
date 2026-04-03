import { getAuth, createUserWithEmailAndPassword, deleteUser, updateProfile, updateEmail, updatePassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

export const auth = {
    //*******************************************************
    //* User Control functions
    //*******************************************************

    /**
     * Initialize Firebase User Interface
     * @param {Object} firebaseApp
     * @returns {Promise} resolve() - Success | reject(error) - Fail
     */
    init(firebaseApp) {
        return new Promise(async (resolve, reject) => {
            try {
                // Initialize Firebase Authentication and get a reference to the service
                this.auth = await getAuth(firebaseApp);

                resolve();
            } catch(error) {
                reject(error);
            }
        });
    }, //init

    /**
     * Create a user account with email and password
     * @param {string} email
     * @param {string} password
     * @returns {Promise} resolve(userData) - Success | reject(error) - Fail
     */
    createUser(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                await createUserWithEmailAndPassword(this.auth, email, password);
                resolve({email: email, password: password});
            } catch(error) {
                reject(error);
            }
        });
    }, //createUser

    /**
     * delete current user
     * @returns {Promise} resolve() - Success | reject(error) - Fail
     */
    delUser() {
        return new Promise(async (resolve, reject) => {
            let user = this.auth.currentUser;
            if (user !== null) {
                try {
                    await deleteUser(getAuth().currentUser);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            } else {
                reject({code: -1, message: "Firebase: User not logged."});
            }
        });
    }, //delUser

    /**
     * get current user profile
     * @returns {Object} currentUser = { uid:{string},email:{string},emailVerified:{string},displayName:{string},photoURL:{string} }
     */

    getCurrentUser() {
        return this.auth.currentUser;
    }, //getCurrentUser

    /**
     * set current user profile
     * @param {Object} profile = { displayName:{string},photoURL:{string} }
     * @returns {Promise} resolve() - Success | reject(error) - Fail
     */

    setUserProfile(profile) {
        return new Promise(async(resolve, reject) => {
            let user = this.auth.currentUser;
            if(user !== null) {
                try {
                    await updateProfile(user, profile);
                    resolve();
                } catch(error) {
                    reject(error);
                }
            } else {
                reject({code:-1, message:"Firebase: User not logged."});
            }
        });
    }, //setUserProfile

    /**
     * Send Email Verification to current user 
     * @returns {Promise} resolve() - Success | reject(error) - Fail
     */
    sendEmailVerification() {
        return new Promise((resolve, reject) => {
            let user = this.auth.currentUser;
            if(user !== null) {
                sendEmailVerification(user).then(() => resolve()).catch((error) => reject(error));
            } else {
                reject({code:-1, message:"Firebase: User not logged."});
            }
        });
    }, //sendEmailVerification

    /**
     * Change Email of current user 
     * @param {string} email
     * @returns {Promise} resolve() - Success | reject(error) - Fail
     */
    changeEmail(email) {
        return new Promise((resolve, reject) => {
            let user = this.auth.currentUser;
            if(user !== null) {
                updateEmail(user, email).then(async () => {
                    await this.logout();
                    resolve();
                }).catch((error) => reject(error));
            } else {
                reject({code:-1, message:"Firebase: User not logged."});
            }
        });
    }, //changeEmail

    /**
     * Change password of current user 
     * @param {string} password
     * @returns {Promise} resolve() - Success | reject(error) - Fail
     */
    changePassword(password) {
        return new Promise((resolve, reject) => {
            let user = this.auth.currentUser;
            if(user !== null) {
                updatePassword(user, password).then(async () => {
                    await this.logout();
                    resolve();
                }).catch((error) => reject(error));
            } else {
                reject({code:-1, message:"Firebase: User not logged."});
            }
        });
    }, //changePassword

    /**
     * send Password Reset Email
     * @param {string} email
     * @returns {Promise}
     */
    resetPassword(email) {
        return new Promise((resolve, reject) => {
            sendPasswordResetEmail(this.auth, email).then(() => resolve()).catch((error) => reject(error));
        });
    }, //resetPassword

    /**
     * Login with email and password
     * @param {string} email
     * @param {string} password
     * @returns {Promise} resolve() - Success | reject(error) - Fail
     */
    login(email, password) {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(this.auth, email, password).then(() => {
                resolve();
            }).catch((error) => reject(error));
        });
    }, //login

    /**
     * Logout current user
     * @returns {Promise} resolve() - Success | reject(error) - Fail
     */
    logout() {
        return new Promise((resolve, reject) => {
            signOut(this.auth).then(() => {
                resolve();
            }).catch((error) => reject(error));
        });
    }, //logout

    /**
     * on Auth State Changed Event
     * @param {function} functionStateChanged
     * @returns {undefined}
     */
    authStateChanged(functionStateChanged) {
        onAuthStateChanged(this.auth, functionStateChanged);
    }, //authStateChanged

    /**
     * return current user
     * @returns {object} current user || null
     */
    currentUser() {
        return this.auth.currentUser;
    } //currentUser

}; //auth