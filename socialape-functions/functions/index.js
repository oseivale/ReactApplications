const functions = require('firebase-functions');
const admin= require('firebase-admin'); 

const serviceAccount = require('./My Project-7506d40c03bd.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:  'https://socialape-98942.firebaseio.com/'
});


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello world");
});

//This function is for GETTING documents
exports.getScreams = functions.https.onRequest((req, res) => {
//Our function now needs access to the db, we will use admin sdk
    admin.firestore().collection('screams').get()
        .then((data) => {
            let screams = [];
            data.forEach(doc => {
                screams.push(doc.data());
            });
            return res.json(screams);
        })
        .catch((err) => console.error(err));
});

//Create a function for actually CREATING documents
exports.createScream = functions.https.onRequest((req, res) => {
//This will be a POST request and we should get a request body

if(req.method !== 'POST'){ //This method will prevent us from sending a request using the wrong method - meant for a POST req
    return res.status(400).json({ error: 'Method not allowed'})
}
const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
};

admin.firestore()
    .collection('screams')
    .add(newScream)
    .then((doc) => {
        res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
        res.status(500).json({ error: 'something went wrong' });
        console.error(err);
    });
});