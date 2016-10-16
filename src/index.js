import app from 'app';
import { PORT } from 'config';
import { log } from 'util';

const server = app.listen(PORT, function () {
  const host = server.address().address;
  const port = server.address().port;

  log(`Listening at http://${host}:${port}`);
});
