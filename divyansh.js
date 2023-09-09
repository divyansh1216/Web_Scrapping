const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const { writeFile} = require('fs/promises');
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.flipkart.com/search?q=iphone&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=off&as=off');
  await page.type('._1fQZEK', 'iphone');
  const pageContent = await page.content();
  const $ = cheerio.load(pageContent);

  const productsData = [];
$('._1fQZEK').each((index, element) => {
  if (productsData.length < 20) { // Check if we have less than 20 items
    const productName = $(element).find("._4rR01T").text().trim();
    const productPrice = $(element).find("._30jeq3 ").text().trim();
    const productDescription = $(element).find('._1xgFaf').text().trim();
    const productImage = $(element).find('._396cs4').attr('src');
    productsData.push({
      name: productName,
      price: productPrice,
      description: productDescription,
      imageUrl: productImage,
    });
  }
});
await writeFile('products.json', JSON.stringify(productsData, null,4))
const csvHeader = 'Name,Price,Description,ImageURL\n';
const csvData = productsData.map(product => `${product.name},${product.price},${product.description},${product.imageUrl}\n`).join('');

const csvContent = csvHeader + csvData;
fs.writeFileSync('products.csv', csvContent, 'utf8');
await browser.close();
})();

