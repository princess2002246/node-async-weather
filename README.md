# Task 7 - Async Weather & News Dashboard

**Module:** NodeTS  
**Submission Date:** 05 November 2026  
**Submission Time:** 09:00 AM  
**Developer:** Princess Tau

## 1. Project Overview

The Async Weather & News Dashboard is a Node.js and TypeScript application that demonstrates asynchronous programming using three different approaches:

- Callbacks
- Promises
- Async/Await

The application retrieves weather information from the Open-Meteo API and news headlines from the DummyJSON Posts API.

The project demonstrates how asynchronous operations allow an application to retrieve information from external APIs without blocking the execution of other operations.

## 2. Technologies Used

- Node.js
- TypeScript
- JavaScript
- HTTPS module
- Fetch API
- Open-Meteo API
- DummyJSON Posts API
- npm

## 3. APIs Used

### Open-Meteo API

Used to retrieve geographical coordinates and current weather information.

- Geocoding: https://geocoding-api.open-meteo.com/v1/search
- Weather: https://api.open-meteo.com/v1/forecast

Weather information includes:
- Temperature
- Relative humidity
- Wind speed

### DummyJSON Posts API

Used to retrieve sample news headlines.

https://dummyjson.com/posts?limit=5

The application displays five posts, including their titles and descriptions.

## 4. Project Structure

```text
node-async-weather/
│
├── src/
│   ├── callbacks/
│   │   └── callbackVersion.ts
│   │
│   ├── promises/
│   │   └── promiseVersion.ts
│   │
│   ├── async-await/
│   │   └── asyncAwaitVersion.ts
│   │
│   └── utils/
│       └── errors.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 5. Installation and Setup

### Prerequisites

- Node.js installed
- npm installed
- Git installed

### Clone the repository

```bash
git clone https://github.com/princess2002246/node-async-weather.git
```

Navigate into the project:

```bash
cd node-async-weather
```

Install dependencies:

```bash
npm install
```

Build the TypeScript project:

```bash
npm run build
```

## 6. Running the Application

The application supports three implementations.

### A. Callback Version

```bash
npm run callback
```

This implementation uses Node.js HTTPS requests and callback functions.

It demonstrates nested callbacks, where the weather and location requests must complete before the next dependent operation can continue.

### B. Promise Version

```bash
npm run promise
```

This implementation demonstrates:

- Promise chaining using `.then()`
- Error handling using `.catch()`
- `Promise.all()` to execute weather and news requests simultaneously
- `Promise.race()` to demonstrate which request settles first

### C. Async/Await Version

```bash
npm run async
```

This implementation uses async functions and the `await` keyword to make asynchronous operations easier to read.

It also uses `try...catch` to handle errors.

## 7. Testing Different Locations

The application accepts a city name as an optional command-line argument.

Examples:

```bash
npm run callback -- "Kimberley"
npm run promise -- "Kimberley"
npm run async -- "Kimberley"
```

To test an invalid location:

```bash
npm run callback -- "Xyznonexistentcity123"
npm run promise -- "Xyznonexistentcity123"
npm run async -- "Xyznonexistentcity123"
```

The application displays a readable location error when a city cannot be found.

## 8. Sample Console Outputs

The exact weather values and news headlines may change because the application retrieves live API responses.

### Callback Implementation

```text
ASYNC WEATHER & NEWS DASHBOARD
CALLBACK IMPLEMENTATION

Searching for weather in Kimberley...

Location: Kimberley, South Africa

Fetching weather information...

Weather information fetched successfully!

---------- WEATHER ----------
Temperature: [Live temperature] °C
Humidity: [Live humidity]%
Wind Speed: [Live wind speed] km/h

---------- NEWS HEADLINES ----------
1. [News headline]
[News description]

DASHBOARD LOADING COMPLETED
```

### Promise Implementation

```text
ASYNC WEATHER & NEWS DASHBOARD
PROMISE IMPLEMENTATION

Fetching weather information...
Fetching news headlines...

---------- WEATHER ----------
Temperature: [Live temperature] °C
Humidity: [Live humidity]%
Wind Speed: [Live wind speed] km/h

---------- NEWS HEADLINES ----------
1. [News headline]
[News description]

Promise chaining completed.
Promise.all() completed.
Promise.race() completed.
```

### Async/Await Implementation

```text
ASYNC WEATHER & NEWS DASHBOARD
ASYNC/AWAIT IMPLEMENTATION

Searching for weather in Kimberley...

Location: Kimberley, South Africa

---------- WEATHER ----------
Temperature: [Live temperature] °C
Humidity: [Live humidity]%
Wind Speed: [Live wind speed] km/h

---------- NEWS HEADLINES ----------
1. [News headline]
[News description]

DASHBOARD LOADING COMPLETED
```

## 9. Error Handling

Consistent error handling is implemented across the three asynchronous approaches.

The shared error utility is located in:

`src/utils/errors.ts`

The application uses the following error categories:

| Category | Description |
|---|---|
| LOCATION | City could not be found |
| NETWORK | Internet connection or network problem |
| TIMEOUT | API request took too long |
| API | API returned an unsuccessful response |
| DATA | Invalid API response |
| ERROR | Unexpected application error |

These categories make errors easier to understand and troubleshoot.

## 10. Learning Outcomes

Through this project, I gained practical experience in:

1. Understanding asynchronous programming in Node.js.
2. Working with callback functions and nested callbacks.
3. Creating and chaining Promises.
4. Using `Promise.all()` for simultaneous asynchronous operations.
5. Using `Promise.race()` to identify the first settled asynchronous operation.
6. Refactoring Promise-based code using async/await.
7. Handling errors using callbacks, `.catch()` and `try...catch`.
8. Fetching and processing information from external APIs.
9. Working with TypeScript interfaces and type safety.
10. Understanding how asynchronous operations support responsive applications.

## 11. Conclusion

The Async Weather & News Dashboard demonstrates three different approaches to asynchronous programming using the same practical application.

By implementing callbacks, promises and async/await, I developed a better understanding of how Node.js handles asynchronous operations, external API requests and error handling.

The project also strengthened my practical skills in TypeScript, API integration, debugging and application development.

---

**GitHub Repository:**  
https://github.com/princess2002246/node-async-weather

**Developer:** Princess Tau