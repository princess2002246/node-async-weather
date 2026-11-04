

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


async function fetchData<T>(url: string): Promise<T> {

    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error(
                `API Error: Request failed with status ${response.status}.`
            );
        }

        return await response.json() as T;

    } catch (error: unknown) {

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
    }
}


async function getCoordinates(city: string): Promise<Coordinates> {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const data = await fetchData<{
        results?: {
            latitude: number;
            longitude: number;
            name: string;
            country: string;
        }[];
    }>(url);

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
}


async function getWeather(
    coordinates: Coordinates
): Promise<WeatherData> {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}` +
        `&longitude=${coordinates.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

    return await fetchData<WeatherData>(url);
}


async function getNews(): Promise<NewsResponse> {

    const url = "https://dummyjson.com/posts?limit=5";

    return await fetchData<NewsResponse>(url);
}


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


function displayNews(news: NewsResponse): void {

    console.log("\n---------- NEWS HEADLINES ----------");

    news.posts.forEach((post, index) => {
        console.log(`\n${index + 1}. ${post.title}`);
        console.log(post.body);
    });
}



async function runAsyncAwaitVersion(city: string): Promise<void> {

    console.log("\n==================================");
    console.log(" ASYNC WEATHER & NEWS DASHBOARD");
    console.log(" ASYNC/AWAIT IMPLEMENTATION");
    console.log("==================================");

    try {

        console.log(`\nSearching for: ${city}`);

        // Get city coordinates
        const coordinates = await getCoordinates(city);

        console.log(
            `\nLocation: ${coordinates.name}, ${coordinates.country}`
        );

        // Fetch weather information
        console.log("\nFetching weather information...");

        const weather = await getWeather(coordinates);

        console.log("\nWeather fetched successfully!");

        displayWeather(weather);

        // Fetch news headlines
        console.log("\nFetching news headlines...");

        const news = await getNews();

        console.log("\nNews fetched successfully!");

        displayNews(news);

        console.log("\n==================================");
        console.log(" ASYNC/AWAIT DASHBOARD COMPLETED");
        console.log("==================================\n");

    } catch (error: unknown) {

        if (error instanceof Error) {

            console.error("\nDashboard Error:", error.message);

        } else {

            console.error(
                "\nDashboard Error: An unexpected error occurred."
            );
        }
    }
}

// 9. Start application

const city = process.argv[2] || "Kimberley";

runAsyncAwaitVersion(city);
