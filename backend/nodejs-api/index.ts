import bodyParser from "body-parser";
import express from "express";
import { makeAdapter } from "./config/db";
import { dummyMiddleware } from "./middleware/dummy";
import { createListRouter } from "./routes/shared";

const app = express();
app.use(bodyParser.json());
app.use(dummyMiddleware);

(async () => {
  const adapter = await makeAdapter();

  app.use("/wishlist", createListRouter(adapter, "wishlist"));
  app.use("/caught", createListRouter(adapter, "caught"));

  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () =>
    console.log(`pokodex backend listening on http://localhost:${port}`)
  );
})();
