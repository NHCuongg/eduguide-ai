async function main() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        console.error("No API key found.");
        process.exit(1);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        const data = await response.json();
        console.log("MODELS:");
        if (data.models) {
            data.models.forEach(m => {
                console.log(m.name);
            });
        } else {
            console.log("No models returned.");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
