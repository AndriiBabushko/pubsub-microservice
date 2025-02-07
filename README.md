# Pub/Sub Microservice

A simple microservice for publishing and subscribing, implemented using [NestJS](https://nestjs.com/) and Redis. The service allows:

- Publishing data to designated topics via HTTP POST requests.
- Subscribing to topics using SSE.
- Achieving horizontal scalability by using Redis as a message broker.

## Features

- **Horizontal Scalability:** Redis Pub/Sub enables multiple instances of the application to exchange messages.
- **High Performance:** The project is designed to handle around 1000 RPS.
- **Handling Large JSON Objects:** Supports transferring large JSON objects (100+ KB).

## Requirements

- Node.js (recommended version 18.x or higher)
- Redis
- npm

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AndriiBabushko/pubsub-microservice.git
   cd pubsub-microservice
    ```

2. **Install dependencies:** 

   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**

   Create a `.env` file in the root directory of the project and add the following variables:

   ```plaintext
   REDIS_URL=redis://localhost:6379
   PORT=3000
   ```


# Running the Service

As an example, here I use Arch Linux. So, all commands will be presented for this system.

## Ensure Redis is Running

Install and run Redis. You can do it with the following commands:

```bash
sudo pacman -S redis
sudo systemctl start redis
sudo systemctl enable redis
```

Check if Redis is running:

```bash
redis-cli ping
```

The command should return: `PONG`.

## Start the NestJS Application

Run the application in development mode:

```bash
npm run start:dev
```

The application will be available at http://localhost:3000.

# API Usage

## Publishing Messages

Send a POST request to publish a message to a topic (e.g., `someTopic`):

```bash
curl -X POST 'http://localhost:3000/topics/someTopic' \
    -H 'Content-Type: application/json' \
    -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello World"
    }'
```

## Subscribing to a Topic using SSE request

Subscribe to messages from the `someTopic` topic using SSE:

```bash
curl -N \
    -H "Accept: text/event-stream" \
    'http://localhost:3000/topics/someTopic'
```

Each time a message is published to `someTopic`, the subscribed client will receive the data.

# Testing

## Commands for Testing

To test the application, you can use Apache Benchmark (ab) tool. Here is the command for testing 10000 requests with a concurrency level of 1000:

```bash
ab -n 10000 -c 1000 -p payload.json -T 'application/json' http://localhost:3000/topics/myTopic
```

Also, here is the command to check the ability to handle large JSON objects (100+ KB):

```bash
yarn test:e2e
```  

## Result of Testing

After testing an application using above commands, here is the result of testing:

1. **Testing with 10000 requests and a concurrency level of 1000:**
    
    ```zsh
    This is ApacheBench, Version 2.3 <$Revision: 1923142 $>
    Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
    Licensed to The Apache Software Foundation, http://www.apache.org/
    
    Benchmarking localhost (be patient)
    Completed 1000 requests
    Completed 2000 requests
    Completed 3000 requests
    Completed 4000 requests
    Completed 5000 requests
    Completed 6000 requests
    Completed 7000 requests
    Completed 8000 requests
    Completed 9000 requests
    Completed 10000 requests
    Finished 10000 requests
    
    
    Server Software:        
    Server Hostname:        localhost
    Server Port:            3000
    
    Document Path:          /topics/myTopic
    Document Length:        16 bytes
    
    Concurrency Level:      1000
    Time taken for tests:   2.897 seconds
    Complete requests:      10000
    Failed requests:        0
    Total transferred:      2280000 bytes
    Total body sent:        2320000
    HTML transferred:       160000 bytes
    Requests per second:    3452.28 [#/sec] (mean)
    Time per request:       289.664 [ms] (mean)
    Time per request:       0.290 [ms] (mean, across all concurrent requests)
    Transfer rate:          768.67 [Kbytes/sec] received
                            782.16 kb/s sent
                            1550.83 kb/s total
    
    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:        0   51 223.0      0    2024
    Processing:    30  199 317.5    127    1720
    Waiting:       11  198 317.6    127    1720
    Total:         30  249 532.0    128    2753
    
    Percentage of the requests served within a certain time (ms)
      50%    128
      66%    131
      75%    133
      80%    140
      90%    171
      95%    300
      98%   2710
      99%   2729
     100%   2753 (longest request)
    ```

2. **Testing with large JSON objects (100+ KB):**

    ```zsh
    yarn run v1.22.22
    $ jest --config ./test/jest-e2e.json
    console.log
    Payload size in bytes: 96730
    
          at Object.<anonymous> (large-endpoint.e2e-spec.ts:39:13)
    
    PASS  test/large-endpoint.e2e-spec.ts
    Pub/Sub Microservice - Large Payload (e2e)
    ✓ should accept and process a large JSON payload (100+ KB) (42 ms)
    
    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        1.67 s, estimated 2 s
    Ran all test suites.
    Done in 2.05s.
    ```
