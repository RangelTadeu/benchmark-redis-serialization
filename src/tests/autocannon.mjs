import autocannon from "autocannon";
import redis from "../redisClient.mjs";
import fs from "fs";

const testSize = process.argv[2];
const serializer = process.argv[3];

function saveResults(testName, results) {
  const data = JSON.stringify(results, null, 2);
  fs.writeFileSync(`src/tests/results/${testName}.json`, data);

  console.log(`Results for test ${testName} saved`);
}

function formatMemory(bytes) {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const size = 1024;
  const exponent = Math.floor(Math.log(bytes) / Math.log(size));
  const formattedMemory = parseFloat(
    (bytes / Math.pow(size, exponent)).toFixed(4)
  );
  return formattedMemory + " " + units[exponent];
}

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
