import { Router } from 'express';
import { log } from 'util';

let router = Router();

// import ruby to js comiler.
import ruby from 'compiler/ruby';

router.post('/', (req, res) => {
  if(req.body && req.body.code && typeof req.body.code === 'string'){
    try {
      res.json({ js: ruby(req.body.code) });
    } catch (err) {
      log(err);
      res.status(500).json({ message: 'Code failed to comiple.' });
    }
  } else {
    log(req.body);
    log('incorrect format of ruby code.');
    res.status(400).json({
      message:
        'Body of request must be a JSON object containing ' +
        'a String typed code member.',
    });
  }
});

export default router;
