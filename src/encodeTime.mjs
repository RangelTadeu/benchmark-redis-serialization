import { Packr } from "msgpackr";
import { createRandomUser } from "./utils.mjs";
import { saveResults } from "./utils.mjs";
import zlib from "zlib";

const serializer = process.argv[2];

const packr = new Packr({
  maxSharedStructures: 8160,
  structures: [],
});

const pack = packr.pack.bind(packr);

const qtdItemsPerTest = [10, 100, 1000, 10_000, 100_000];

const encoder = {
  json: JSON.stringify,
  msgpack: pack,
  gzip: async (data) =>
    zlib.gzipSync(Buffer.from(JSON.stringify(data), "utf-8")),
};

function mensureEncodeTimes(serializer, encodeFn) {
  const summary = {
    serializer,
  };

  for (const qtd of qtdItemsPerTest) {
    const mensures = [];

    for (let i = 0; i < 25; i++) {
      const users = Array.from({ length: qtd }, createRandomUser);

      const start = process.hrtime.bigint();
      const encodedUsers = encodeFn(users);
      const end = process.hrtime.bigint();

      const time = Number(end - start) / 1e6;

      mensures.push({ time });
    }

    const avgTime =
      mensures.reduce((acc, { time }) => acc + time, 0) / mensures.length;

    summary[qtd] = `${avgTime.toFixed(4)} ms`;
  }

  return summary;
}

const encodeFn = encoder[serializer];

const results = mensureEncodeTimes(serializer, encodeFn);

saveResults(`encodeTime-${serializer}`, results);

console.log(results);
