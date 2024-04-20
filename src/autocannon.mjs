import autocannon from "autocannon";
import redis from "./redisClient.mjs";
import { formatMemory, saveResults } from "./utils.mjs";

const testSize = process.argv[2];
const serializer = process.argv[3];

async function runTest(testSize, serializer) {
  const testName = `${testSize}-${serializer}`;

  console.log(`Running test ${testName}`);

  await redis.flushall();

  const result = await autocannon({
    url: "http://localhost:3000/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    title: testName,
    body: JSON.stringify({
      test: testSize,
      serializer: serializer,
    }),
  });

  const redisUsedMemory = await redis.memory("usage", `test:${testSize}`);

  const formattedMemory = formatMemory(redisUsedMemory);

  saveResults(testName, { redisUsedMemory: formattedMemory, ...result });

  console.log(`Test ${testName} completed`);
}

runTest(testSize, serializer);
