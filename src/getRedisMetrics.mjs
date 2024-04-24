import fs from "fs";
import { Redis } from "ioredis";

const host = process.argv[2] || "localhost";
const port = process.argv[3] || 6379;
const interval = process.argv[4] || 5000;
const fileName = process.argv[5] || "redis-usage-memory.csv";

const extractProperty = (infoString, propertyName) => {
  const regex = new RegExp(`${propertyName}:(.*?)\r\n`);
  const match = regex.exec(infoString);
  return match ? match[1] : null;
};

const snapshot = async () => {
  const redis = new Redis({
    host,
    port,
  });

  const writeStream = fs.createWriteStream(fileName);

  if (!fs.existsSync(fileName)) {
    writeStream.write("used_memory,used_memory_human,timestamp\n");
  }

  while (true) {
    const info = await redis.info();

    const usedMemory = extractProperty(info, "used_memory");
    const usedMemoryHuman = extractProperty(info, "used_memory_human");

    writeStream.write(
      `${usedMemory},${usedMemoryHuman},${new Date().getTime()}\n`
    );

    await new Promise((resolve) => setTimeout(resolve, interval));
  }
};

snapshot().then(console.log);
