var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

var serviceAccount = require("../ionic-react-training-firebase-adminsdk-6rhqq-3cce01dba1.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

router.post('/', function (req, res, next) {

    var payload = {
        notification: {
            title: req.body.title,
            body: req.body.body,
        },

    };

    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    const registrationToken = 'd9BCFQDWRVSlir9h7ecenA:APA91bG-PXfqdnm6AIZyuRB0RNgmB7nJf_EK9rY03bXJSnqcRRFHyDNkXv3_xSlSc6rhLLmEMlKK0PDMaHS3UwLMSVqFcWxjaVWPmpQTBuiJLGeV5D5CnnF2rFISpywzf8q4J-y7PdSa';

    admin.messaging().sendToDevice(registrationToken, payload, notification_options)
        .then(response => {
            console.log(response);
            res.status(200).send({ status: "success", message: "Notification sent successfully", errorMessage: "" });
        })
        .catch(error => {
            console.log(error);
            res.status(200).send({ status: "error", message: "Faileed to send notification", errorMessage: error });
        });
});

module.exports = router;