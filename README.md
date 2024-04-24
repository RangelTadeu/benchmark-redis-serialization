# MessagePack vs JSON - Benchmark

I've been searching for a more efficient yet simple way to store data in Redis within our existing projects. Although JSON is great for humans, it's terribly inefficient for data storage, especially in expansive services like Redis.

[MessagePack](https://msgpack.org) caught my attention due to its simplicity of implementation in our existing projects.

This benchmark evaluates the performance of JSON and MessagePack serialization in terms of requests per second, memory usage, and encoding times.

All tests were conducted on a 16-inch 2021 MacBook Pro with M1 Pro chip and 32GB RAM (running Sonama 14.4.1 OS).

For the Requests Per Second test, I used Express and autocannon.

The JSON structure used in the arrays follows this standard:

```json
{
  "userId": "0cc4a521-4285-4128-aa85-c22fc128320a",
  "username": "Dahlia_Morar6",
  "email": "Cletus_Turcotte@yahoo.com",
  "birthdate": "2001-09-29T22:04:03.682Z",
  "registeredAt": "2024-03-30T05:35:01.461Z",
  "lastLogin": "2024-04-19T03:24:53.853Z"
}
```

### Dependencies

To create the JSON files:

```bash
yarn createfiles
```

To start the redis container:

```bash
yarn redis:up
```

### Running tests

There is a script for each test and array size in the Package.json file.

## Results

### Requests Per Second

| Array Length | Json   | MsgPack | Difference |
| ------------ | ------ | ------- | ---------- |
| 10           | 90,715 | 92,231  | 1.7%       |
| 100          | 45,145 | 52,009  | 15.2%      |
| 1k           | 6,853  | 8,360   | 22.0%      |
| 10k          | 577    | 700     | 21.3%      |
| 100k         | 49     | 52      | 6.1%       |

### Memory Usage

| Array Length | Json   | MsgPack | Difference |
| ------------ | ------ | ------- | ---------- |
| 10           | 2.6 KB | 1.8 KB  | -29.4%     |
| 100          | 24 KB  | 16 KB   | -33.3%     |
| 1k           | 256 KB | 160 KB  | -37.5%     |
| 10k          | 2.5 MB | 1.5 MB  | -40.0%     |
| 100k         | 24 MB  | 16 MB   | -33.3%     |

### Encoding times (ms)

| Array Length | Json   | MsgPack | Difference |
| ------------ | ------ | ------- | ---------- |
| 10           | 0.06   | 0.12    | 102.8%     |
| 100          | 0.30   | 0.23    | -23.5%     |
| 1k           | 2.82   | 0.97    | -65.7%     |
| 10k          | 28.25  | 9.41    | -66.7%     |
| 100k         | 289.70 | 97.29   | -66.4%     |

### Considerations

In most scenarios, MessagePack outperformed JSON, especially with large arrays. The reduction in memory usage is particularly impressive.

The exception is when encoding very small JSON files, where JSON.stringify() performs better than MessagePack. When the array size increases from 10 to 100, MessagePack performs 23.5% better.

Overall, I believe it's worth considering switching to MessagePack for serialization in data storage and also replacing JSON format in service communications.
