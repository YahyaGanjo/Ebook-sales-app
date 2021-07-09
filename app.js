const express = require("express");
const keys = require("./views/config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();
const port = process.env.PORT || 5000;

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get("/", (req, res) => {
  res.render("index", {
    stripePublishableKey: keys.stripePublishableKey,
  });
});

// Purchase Route
app.post("/purchase", (req, res) => {
  const amount = 2000;
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges
        .create({
          amount,
          description: "Web development e-book",
          currency: "eur",
          customer: customer.id,
        })
        .then((charge) => res.render("success"))
    );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
