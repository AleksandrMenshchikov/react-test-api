const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes/index');
const cors = require('./security_helpers/cors');
const { requestLogger } = require('./middlewares/logger');
const { errorLogger } = require('./middlewares/logger');
const limiter = require('./security_helpers/rateLimit');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');

mongoose.connect('mongodb://localhost:27017/243546db');

const app = express();
const { PORT = 4000 } = process.env;
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(helmet());
app.use(cors);

app.use(requestLogger); // подключаем логгер запросов

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
