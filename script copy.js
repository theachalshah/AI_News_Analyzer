document.addEventListener("DOMContentLoaded", function () {
    const classifyButton = document.getElementById("classify-button");
    const refreshButton = document.getElementById("refresh-button");
    const newsText = document.getElementById("news-text");
    const politicalSpectrum = document.getElementById("political-spectrum");
    const resultContainer = document.getElementById("result-container");

    classifyButton.addEventListener("click", async function () {
        // console.log(newsText.value)
        try {
            const classifiedResult = await classifyNews(newsText.value);
            politicalSpectrum.textContent = classifiedResult.politicalSpectrum;
            resultContainer.style.display = "block";
        } catch (error) {
            console.error("Error:", error);
            // Handle the error (e.g., display an error message)
        }
    });

    refreshButton.addEventListener("click", function () {
        newsText.value = "";
        politicalSpectrum.textContent = "";
        resultContainer.style.display = "none";
    });
});

async function classifyNews(newsText) {
    console.log("payload:",JSON.stringify({ news: newsText }))
    const response = await fetch('http://localhost:5049/classify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ news: newsText })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// async function classifyNews(newsText) {
//     // Endpoint URL
//     const url = 'http://127.0.0.1:5049/classify';

//     try {
//         // Make a POST request to the server
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ news: newsText }),
//         });

//         // Check if the response is OK
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // Parse the JSON response
//         const data = await response.json();

//         // Process the response data
//         console.log('Response:', data);
//         return data;
//     } catch (error) {
//         // Handle any errors that occurred during the fetch
//         console.error('Error during fetch:', error);
//         throw error;
//     }
// }

// Example usage:
// classifyNews("Your news text here").then(data => console.log(data));

