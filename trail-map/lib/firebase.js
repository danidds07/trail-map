/* 
    Created on : 30/10/2023, 19:21:36
    Author     : marcos morise マルコス 森瀬
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { auth } from "./auth.js";
import { firestore } from "./firestore.js";

//*******************************************************
//* Firebase Controller - fb.js
//*******************************************************
export const firebase = {
    /**
     * Initialize Firebase User Interface
     * @param {Object} config = {apiKey:"",authDomain:"",projectId:"",storageBucket:"",messagingSenderId:"",appId:""}
     * @returns {Promise} resolve() - Success | reject(error) - Fail
     */
    init(config) {
        return new Promise(async (resolve, reject) => {
            try {
                // Initialize Firebase
                this.app = await initializeApp(config);

                // Initialize Firebase Authentication and get a reference to the service
                this.auth = auth;
                await this.auth.init(this.app);

                // Initialize Cloud Firestore and get a reference to the service
                this.firestore = firestore;
                await this.firestore.init(this.app);

                resolve();
            } catch(error) {
                reject("FIREBASE:" + error);
            }
        });
    }, //init

}; //firebase