import fs from "fs";
import { faker } from "@faker-js/faker";

export function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
    lastLogin: faker.date.recent(),
  };
}

export function saveResults(testName, results) {
  const data = JSON.stringify(results, null, 2);
  fs.writeFileSync(`src/tests/results/${testName}.json`, data);

  console.log(`Results for test ${testName} saved`);
}

export function formatMemory(bytes) {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const size = 1024;
  const exponent = Math.floor(Math.log(bytes) / Math.log(size));
  const formattedMemory = parseFloat(
    (bytes / Math.pow(size, exponent)).toFixed(4)
  );
  return formattedMemory + " " + units[exponent];
}
