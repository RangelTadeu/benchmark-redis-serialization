import { Packr } from "msgpackr";

const packr = new Packr();
const encode = packr.pack.bind(packr);
const decode = packr.unpack.bind(packr);

const input = {
  中文: "一些中文文本在这里", // Chinese
  日本語: "いくつかの日本語のテキストがここにあります", // Japanese
  한국어: "여기에 일부 한국어 텍스트가 있습니다", // Korean
  हिन्दी: "कुछ हिंदी टेक्स्ट यहाँ है", // Hindi
  العربية: "بعض النصوص العربية هنا", // Arabic
  русский: "Некоторый русский текст здесь", // Russian
};

const encoded = encode(input);
const decoded = decode(encoded);

console.log(
  "input matches decoded",
  Object.keys(input).every((key) => input[key] === decoded[key])
);
