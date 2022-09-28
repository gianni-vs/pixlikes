const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");
const app = jsonServer.create();
const router = jsonServer.router("db.json");

const port = process.env.PORT || 8081;

app.db = router.db;
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "Amiga Workbench 1.3");
  next();
});

const rules = auth.rewriter({
  // users can only write their own likes
  users: 644,
  likes: 644,
});

app.use(rules);
app.use(auth);
app.use(router);

app.listen(port, () => {
  console.log(`Pixlikes backend listening on port ${port}`);
});
