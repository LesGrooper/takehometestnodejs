const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// banner
const banner = require('./routes/module-information/banner');
app.use('/api', banner);

// services
const services = require('./routes/module-information/services');
app.use('/api', services);

// auth
const auth = require('./routes/module-membership/auth');
app.use('/api', auth);

// profile
const profile = require('./routes/module-membership/profile');
app.use('/api', profile);

// balance
const balance = require('./routes/module-transaction/balance');
app.use('/api', balance);

// topup
const topup = require('./routes/module-transaction/topup');
app.use('/api', topup);

// transaction
const transaction = require('./routes/module-transaction/transaction');
app.use('/api', transaction);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});