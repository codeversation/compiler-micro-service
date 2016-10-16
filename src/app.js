import express from 'express';
import { log } from 'util';

const app = express();

import headerMiddleware from 'middleware/header';
import bodyParser from 'body-parser';

app.use(headerMiddleware);
app.use(bodyParser.json());

import { V1_API_BASE } from 'config';
import rubyRoute from 'route/ruby';

app.use(`${V1_API_BASE}/ruby`, rubyRoute);

export default app;
