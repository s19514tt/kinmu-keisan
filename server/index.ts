import express from 'express';
import Datastore from "nedb-promises";
let datastore = Datastore.create('./data/db.txt')

const app: express.Express = express();

const allowCrossDomain = function(req:express.Request, res:express.Response, next:express.NextFunction) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  )

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200)
  } else {
    next()
  }
}
app.use(allowCrossDomain)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router: express.Router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  const data = await datastore.find({})
  res.send(data);
});
router.post('/',async (req: express.Request, res: express.Response) => {
  await datastore.insert(req.body)
  res.send()
});
app.use(router);

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
