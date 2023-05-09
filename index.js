const express = require("express");
const request = require("request-promise");
const app = express();
const PORT = process.env.PORT || 5000;
// const apiKey = "89e22e529352fa1f7086d9b3a7c23710";
const scrapUrl = (api) => `http://api.scraperapi.com?api_key=${api}&autoparse=true`

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hemlooo");
});

app.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const {apiKey} = req.query;
  const baseUrl = scrapUrl(apiKey);
  try {
    const response = await request(
      `${baseUrl}&url=https://www.amazon.in/dp/product/${productId}`
    );
    res.json(JSON.parse(response));
  } catch (error) {
    console.log(error);
  }
});
app.get("/reviews/:productId", async (req, res) => {
  const { productId } = req.params;
  const {apiKey} = req.query;
  const baseUrl = scrapUrl(apiKey);
  let allReviews = [];

  try {
    const response = await request(
      `${baseUrl}&url=https://www.amazon.in/product-reviews/${productId}/pageNumber=${1}`
    );
    const response2 = await request(
      `${baseUrl}&url=https://www.amazon.in/product-reviews/${productId}/pageNumber=${2}`
    );
    const data = JSON.parse(response);
    const data2 = JSON.parse(response2);
    allReviews = data.reviews;
    allReviews = allReviews.concat(data2.reviews);
    data.reviews = allReviews;

    res.json(data);

    console.log("length " + data.reviews.length);
  } catch (error) {
    console.log(error);
  }
});
app.get("/search/:searchQuery", async (req, res) => {
  const { searchQuery } = req.params;
  const {apiKey} = req.query;
  const baseUrl = scrapUrl(apiKey);

  try {
    const response = await request(
      `${baseUrl}&url=https://www.amazon.in/s?k=${searchQuery}`
    );

    res.json(JSON.parse(response));
  } catch (error) {
    res.json(error);
  }
});
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
