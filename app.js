const express = require("express");
const mongoose = require("mongoose");
const coronaRoutes = require("./routes/corona");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use("/api/coronas", coronaRoutes);

mongoose.connect(
  "mongodb+srv://corona_user:corona123456@coronacluster-byzzy.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to DB!")
);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
