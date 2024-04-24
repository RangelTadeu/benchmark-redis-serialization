import express from "express";
import { Packr } from "msgpackr";
import redis from "./redisClient.mjs";
import json_10 from "./jsonFiles/10.json" assert { type: "json" };
import json_100 from "./jsonFiles/100.json" assert { type: "json" };
import json_1k from "./jsonFiles/1k.json" assert { type: "json" };
import json_10k from "./jsonFiles/10k.json" assert { type: "json" };
import json_100k from "./jsonFiles/100k.json" assert { type: "json" };
import json_1m from "./jsonFiles/1m.json" assert { type: "json" };
import zlib from "zlib";

const files = {
  10: json_10,
  100: json_100,
  "1k": json_1k,
  "10k": json_10k,
  "100k": json_100k,
  "1m": json_1m,
};

const packr = new Packr({
  maxSharedStructures: 8160,
  structures: [],
});

const serializerFunctions = {
  json: {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
  msgpack: {
    encode: packr.pack.bind(packr),
    decode: packr.unpack.bind(packr),
  },
  gzip: {
    encode: async (data) =>
      zlib.gzipSync(Buffer.from(JSON.stringify(data), "utf-8")),
    decode: async (data) => JSON.parse(zlib.gunzipSync(data).toString("utf-8")),
  },
};

function getExpressInstance(postHandler) {
  const app = express();

  app.use(express.json());

  app.post("/", postHandler);

  app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
  });

  return app;
}

getExpressInstance(async (req, res) => {
  const { test, serializer } = req.body;

  if (!test) {
    return res.status(400).send("No test type provided");
  }

  const key = `test:${test}`;

  try {
    const cached =
      serializer === "msgpack" || serializer === "gzip"
        ? await redis.getBuffer(key)
        : await redis.get(key);

    if (!cached) {
      const file = files[test];
      const encoded = await serializerFunctions[serializer].encode(file);
      await redis.set(key, encoded);
      return res.send(200, file);
    } else {
      const decoded = await serializerFunctions[serializer].decode(cached);
      return res.send(200, decoded);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});
