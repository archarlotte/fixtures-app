const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
  fixture_mid:    { type: String, required: true, unique: true },
  season:         Number,
  competition_name: String,
  fixture_datetime: Date,
  fixture_round:  Number,
  home_team:      String,
  away_team:      String,
});

module.exports = mongoose.model('Fixture', fixtureSchema);
