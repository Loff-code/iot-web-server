const axios = require("axios");
const cheerio = require("cheerio");

// Function to scrape the webpage and extract price and item name
async function scrapeWebpage(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract the price
    const price = $(".product-card__price").text();

    // Extract the item name
    const itemName = $(".product-card__title").text();

    return { price, itemName };
  } catch (error) {
    console.error("Error scraping webpage:", error);
    return null;
  }
}

// Usage example
const url = "https://www.plantorama.dk/bolig/indeplanter/blomstrende";
scrapeWebpage(url)
  .then((data) => {
    if (data) {
      console.log("Price:", data.price);
      console.log("Item Name:", data.itemName);
    } else {
      console.log("Error scraping webpage.");
    }
  })
  .catch((error) => console.error("Error:", error));
