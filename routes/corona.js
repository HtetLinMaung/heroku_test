const express = require("express");
const Corona = require("../models/Corona");
const router = express.Router();

const getTotal = array =>
  array.map(item => item.count).reduce((accu, value) => accu + value);

const calculateTotals = data => {
  const { new_cases, new_deaths } = data;

  const total_cases = data.total_cases + getTotal(new_cases);
  const total_deaths = data.total_deaths + getTotal(new_deaths);
  data.total_cases = total_cases;
  data.total_deaths = total_deaths;
  return data;
};

router
  .route("/")
  .get((req, res) => {
    Corona.find()
      .then(data => {
        res.json(data.map(d => calculateTotals(d)));
      })
      .catch(err => res.status(400).send("Something went wrong"));
  })
  .post((req, res) => {
    const corona = new Corona(req.body);
    corona
      .save()
      .then(data => res.status(201).json(data))
      .catch(err => {
        res.status(400).send("Something went wrong");
      });
  });

router.use("/:id", (req, res, next) => {
  Corona.findById(req.params.id)
    .then(data => {
      req.corona = data;
      next();
    })
    .catch(err => res.status(400).send("Something went wrong"));
});

router
  .route("/:id")
  .get((req, res) => res.json(calculateTotals(req.corona)))
  .put((req, res) => {
    const { corona, body } = req;

    corona.country = body.country;
    corona.total_cases = body.total_cases;
    corona.new_cases = body.new_cases;
    corona.total_recovered = body.total_recovered;
    corona.active_cases = body.active_cases;
    corona.serious_critical = body.serious_critical;
    corona
      .save()
      .then(() => res.json(corona))
      .catch(err => res.status(400).send("Something went wrong"));
  })
  .patch((req, res) => {
    if (req.body.hasOwnProperty("_id")) {
      delete req.body._id;
    }

    for (const [key, value] of Object.entries(req.body)) {
      req.corona[key] = value;
    }

    req.corona
      .save()
      .then(() => res.json(req.corona))
      .catch(err => res.status(400).send("Something went wrong"));
  })
  .delete((req, res) => {
    req.corona
      .remove()
      .then(() => res.sendStatus(204))
      .catch(err => res.status(400).send("Something went wrong"));
  });

module.exports = router;
