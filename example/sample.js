var GomiCal = require("53cal").default;
var scrape = new GomiCal({ city: 1080104, area: 1080104102 });

scrape.whatDate("2021-7-26").then((data) => {
  console.log(data);
});

scrape.dateAndCategoryInMonth(2021, 7).then((data) => console.log(data));
