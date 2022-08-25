const rateLimit = require('express-rate-limit');

const allowlist = ['127.0.0.1'];

module.exports = rateLimit({
  skip: (request, response) => allowlist.includes(request.ip),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
