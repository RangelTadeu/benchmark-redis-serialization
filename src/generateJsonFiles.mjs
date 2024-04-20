import fs from "fs";
import { faker } from "@faker-js/faker";

function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
    lastLogin: faker.date.recent(),
  };
}

function createFile(ItemsQtd, fileName) {
  const file = fs.createWriteStream(fileName);
  file.write("[");

  for (let i = 0; i < ItemsQtd; i++) {
    file.write(JSON.stringify(createRandomUser()));
    if (i < ItemsQtd - 1) {
      file.write(",");
    }
  }

  file.end("]");
}

createFile(10, "src/jsonFiles/10.json");
createFile(100, "src/jsonFiles/100.json");
createFile(1000, "src/jsonFiles/1k.json");
createFile(10_000, "src/jsonFiles/10k.json");
createFile(100_000, "src/jsonFiles/100k.json");
