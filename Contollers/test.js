const axios = require('axios');

//Axios post request to: https://cloudalign-api-sandbox-d86b96b3c8d8.herokuapp.com/thingspeak-data/api
axios.post('https://cloudalign-api-sandbox-d86b96b3c8d8.herokuapp.com/thingspeak-data/api', {
    // Your data here
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('There was an error making the request:', error);
});