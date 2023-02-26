const express = require('express');
const keystone = require('keystone');
const hubspot = require('@hubspot/api-client');

const app = express();
const port = 3000;

// Initialize KeystoneJS and connect to the database
keystone.init({
  'name': 'KeystoneJS App',
  'mongo': 'mongodb://localhost/keystone',
});

// keystone.connect();

// Initialize HubSpot API client
const hubspotClient = new hubspot.Client({ apiKey: 'YOUR_HUBSPOT_API_KEY' });

app.get('/', async (req, res) => {
 res.send('root::');
}); 

// Define the REST API endpoint
app.get('/convert', async (req, res) => {
  try {
    // Retrieve data from KeystoneJS
    const data = await keystone.list('MyModel').model.find({});

    // Convert data to HubSpot properties
    const properties = data.map((item) => {
      return {
        properties: [
          {
            name: 'First Name',
            value: item.firstName,
          },
          {
            name: 'Last Name',
            value: item.lastName,
          },
          // Add any additional properties as required
        ],
      };
    });

    // Send data to HubSpot
    const response = await hubspotClient.contacts.batchCreateOrUpdate(properties);

    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
