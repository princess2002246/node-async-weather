
import * as https from "node:https";
import { IncomingMessage } from "node:http";

// 1. Define data structures

interface Coordinates {
    latitude: number;
    longitude: number;
    name: string;
    country: string;
}

interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
    };
}

interface NewsPost {
    id: number;
    title: string;
    body: string;
}

interface NewsResponse {
    posts: NewsPost[];
}

// 2. Reusable callback-based HTTPS request with error handling

function fetchData<T>(
    url: string,
    callback: (error: Error | null, data?: T) => void
): void {

    let completed = false;

    // Ensure the callback only runs once
    const finish = (error: Error | null, data?: T): void => {
        if (completed) return;

        completed = true;
        callback(error, data);
    };

    const request = https.get(url, (response: IncomingMessage) => {

        let responseData = "";

        // Check API response status
        if (
            response.statusCode === undefined ||
            response.statusCode < 200 ||
            response.statusCode >= 300
        ) {
            finish(
                new Error(
                    `API Error: Request failed with status ${response.statusCode}.`
                )
            );

            response.resume();
            return;
        }

        // Collect response data
        response.on("data", (chunk: Buffer) => {
            responseData += chunk.toString();
        });

        // Process completed response
        response.on("end", () => {
            try {
                const parsedData = JSON.parse(responseData) as T;
                finish(null, parsedData);

            } catch {
                finish(
                    new Error(
                        "Data Error: The API returned an invalid response."
                    )
                );
            }
        });

        // Handle response errors
        response.on("error", () => {
            finish(
                new Error(
                    "Network Error: Unable to read the API response."
                )
            );
        });
    });

    // Handle connection errors
    request.on("error", (error: Error) => {
        if (error.message.includes("Timeout")) {
            finish(error);
        } else {
            finish(
                new Error(
                    "Network Error: Unable to connect. Please check your internet connection."
                )
            );
        }
    });

    // Handle requests that take too long
    request.setTimeout(10000, () => {
        request.destroy(
            new Error("Timeout Error: The API request took too long.")
        );
    });
}

// 3. Get city coordinates

function getCoordinates(
    city: string,
    callback: (error: Error | null, data?: Coordinates) => void
): void {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    fetchData<{
        results?: {
            latitude: number;
            longitude: number;
            name: string;
            country: string;
        }[];
    }>(url, (error, data) => {

        if (error) {
            callback(error);
            return;
        }

        const location = data?.results?.[0];

        if (!location) {
            callback(
                new Error(`City "${city}" was not found.`)
            );
            return;
        }

        callback(null, {
            latitude: location.latitude,
            longitude: location.longitude,
            name: location.name,
            country: location.country
        });
    });
}

// 4. Fetch weather information

function getWeather(
    coordinates: Coordinates,
    callback: (error: Error | null, data?: WeatherData) => void
): void {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}` +
        `&longitude=${coordinates.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

    fetchData<WeatherData>(url, callback);
}

// 5. Fetch news headlines

function getNews(
    callback: (error: Error | null, data?: NewsResponse) => void
): void {

    const url = "https://dummyjson.com/posts?limit=5";

    fetchData<NewsResponse>(url, callback);
}

// 6. Display weather information

function displayWeather(weather: WeatherData): void {

    console.log("\n---------- WEATHER ----------");

    console.log(
        `Temperature: ${weather.current.temperature_2m} °C`
    );

    console.log(
        `Humidity: ${weather.current.relative_humidity_2m}%`
    );

    console.log(
        `Wind Speed: ${weather.current.wind_speed_10m} km/h`
    );
}

// 7. Display news headlines

function displayNews(news: NewsResponse): void {

    console.log("\n---------- NEWS HEADLINES ----------");

    news.posts.forEach((post, index) => {
        console.log(`\n${index + 1}. ${post.title}`);
        console.log(post.body);
    });
}

// 8. Run dashboard using nested callbacks

function runCallbackVersion(city: string): void {

    console.log("\n==================================");
    console.log(" ASYNC WEATHER & NEWS DASHBOARD");
    console.log(" CALLBACK IMPLEMENTATION");
    console.log("==================================");

    console.log(`\nSearching for weather in ${city}...`);

    // Callback 1: Get coordinates
    getCoordinates(city, (error, coordinates) => {

        if (error) {
            console.error("Location Error:", error.message);
            return;
        }

        if (!coordinates) return;

        console.log(
            `\nLocation: ${coordinates.name}, ${coordinates.country}`
        );

        console.log("\nFetching weather information...");

        // Callback 2: Get weather
        getWeather(coordinates, (weatherError, weather) => {

            if (weatherError) {
                console.error("Weather Error:", weatherError.message);
                return;
            }

            if (!weather) return;

            console.log("\nWeather information fetched successfully!");

            displayWeather(weather);

            console.log("\nFetching news headlines...");

            // Callback 3: Get news
            getNews((newsError, news) => {

                if (newsError) {
                    console.error("News Error:", newsError.message);
                    return;
                }

                if (!news) return;

                console.log("\nNews headlines fetched successfully!");

                displayNews(news);

                console.log("\n==================================");
                console.log(" DASHBOARD LOADING COMPLETED");
                console.log("==================================\n");
            });
        });
    });
}

// 9. Run application

const city = process.argv[2] || "Kimberley";

runCallbackVersion(city);
