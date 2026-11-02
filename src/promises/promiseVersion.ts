
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

// 2. Reusable Promise-based API request with error handling

function fetchData<T>(url: string): Promise<T> {
    return fetch(url, {
        signal: AbortSignal.timeout(10000)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `API Error: Request failed with status ${response.status}.`
                );
            }

            return response.json() as Promise<T>;
        })
        .catch((error: unknown) => {

            if (error instanceof Error) {

                if (
                    error.name === "TimeoutError" ||
                    error.name === "AbortError"
                ) {
                    throw new Error(
                        "Timeout Error: The API request took too long."
                    );
                }

                if (error instanceof TypeError) {
                    throw new Error(
                        "Network Error: Unable to connect. Please check your internet connection."
                    );
                }

                if (error instanceof SyntaxError) {
                    throw new Error(
                        "Data Error: The API returned an invalid response."
                    );
                }
            }

            throw error;
        });
}

// 3. Get city coordinates

function getCoordinates(city: string): Promise<Coordinates> {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    return fetchData<{
        results?: {
            latitude: number;
            longitude: number;
            name: string;
            country: string;
        }[];
    }>(url).then((data) => {

        const location = data.results?.[0];

        if (!location) {
            throw new Error(
                `Location Error: City "${city}" was not found.`
            );
        }

        return {
            latitude: location.latitude,
            longitude: location.longitude,
            name: location.name,
            country: location.country
        };
    });
}

// 4. Fetch weather information

function getWeather(
    coordinates: Coordinates
): Promise<WeatherData> {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}` +
        `&longitude=${coordinates.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

    return fetchData<WeatherData>(url);
}

// 5. Fetch news headlines

function getNews(): Promise<NewsResponse> {

    const url = "https://dummyjson.com/posts?limit=5";

    return fetchData<NewsResponse>(url);
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

// 8. Demonstrate Promise chaining

function demonstratePromiseChaining(
    coordinates: Coordinates
): Promise<void> {

    console.log("\n==================================");
    console.log(" PROMISE CHAINING");
    console.log("==================================");

    console.log("\nFetching weather first...");

    return getWeather(coordinates)

        .then((weather) => {

            console.log("\nWeather fetched successfully!");

            displayWeather(weather);

            console.log("\nNow fetching news...");

            return getNews();
        })

        .then((news) => {

            console.log("\nNews fetched successfully!");

            displayNews(news);

            console.log("\nPromise chaining completed.");
        })

        .catch((error: Error) => {

            console.error(
                "\nPromise Chaining Error:",
                error.message
            );
        });
}

// 9. Demonstrate Promise.all()

function demonstratePromiseAll(
    coordinates: Coordinates
): Promise<void> {

    console.log("\n==================================");
    console.log(" PROMISE.ALL()");
    console.log("==================================");

    console.log("\nFetching weather and news simultaneously...");

    return Promise.all([
        getWeather(coordinates),
        getNews()
    ])

        .then(([weather, news]) => {

            console.log("\nBoth requests completed successfully!");

            displayWeather(weather);

            displayNews(news);

            console.log("\nPromise.all() completed.");
        })

        .catch((error: Error) => {

            console.error(
                "\nPromise.all() Error:",
                error.message
            );
        });
}

// 10. Demonstrate Promise.race()

function demonstratePromiseRace(
    coordinates: Coordinates
): Promise<void> {

    console.log("\n==================================");
    console.log(" PROMISE.RACE()");
    console.log("==================================");

    console.log("\nWaiting for the fastest API response...");

    const weatherRequest = getWeather(coordinates).then(
        (data) => ({ source: "weather" as const, data })
    );

    const newsRequest = getNews().then(
        (data) => ({ source: "news" as const, data })
    );

    return Promise.race([
        weatherRequest,
        newsRequest
    ])

        .then((result) => {

            console.log("\nThe first request has completed!");

            if (result.source === "weather") {

                console.log("Weather request finished first.");

                displayWeather(result.data);

            } else {

                console.log("News request finished first.");

                displayNews(result.data);
            }

            console.log("\nPromise.race() completed.");
        })

        .catch((error: Error) => {

            console.error(
                "\nPromise.race() Error:",
                error.message
            );
        });
}

// 11. Run the Promise version

function runPromiseVersion(city: string): void {

    console.log("\n==================================");
    console.log(" ASYNC WEATHER & NEWS DASHBOARD");
    console.log(" PROMISE IMPLEMENTATION");
    console.log("==================================");

    console.log(`\nSearching for: ${city}`);

    getCoordinates(city)

        .then((coordinates) => {

            console.log(
                `\nLocation: ${coordinates.name}, ${coordinates.country}`
            );

            return demonstratePromiseChaining(coordinates)
                .then(() => demonstratePromiseAll(coordinates))
                .then(() => demonstratePromiseRace(coordinates));
        })

        .then(() => {

            console.log("\n==================================");
            console.log(" PROMISE VERSION COMPLETED");
            console.log("==================================\n");
        })

        .catch((error: Error) => {

            console.error(
                "\nDashboard Error:",
                error.message
            );
        });
}

// 12. Start application

const city = process.argv[2] || "Kimberley";

runPromiseVersion(city);
