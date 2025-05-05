const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer     = require('multer');
const { parse }  = require('csv-parse');
const Fixture    = require('./models/Fixture');
const dotenv = require('dotenv');
dotenv.config();

// configure multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

// create express app
const app = express();
app.use(cors());
app.use(express.json());

// TODO: replace with Atlas URI or leave as localhost
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

app.get('/', (req, res) => res.send('API is running'));

/**
 * POST /api/upload
 * Expects: multipart/form-data with a `file` field (CSV)
 */
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // parse CSV
  const records = [];
  const parser = parse(req.file.buffer.toString(), {
    columns: true,            // first row as keys
    skip_empty_lines: true,
    trim: true,
  });

  parser.on('readable', () => {
    let record;
    while ((record = parser.read())) {
      // convert date string to Date object
      record.fixture_datetime = new Date(record.fixture_datetime);
      records.push(record);
    }
  });

  parser.on('error', err => {
    console.error(err);
    res.status(500).json({ error: 'CSV parsing failed' });
  });

  parser.on('end', async () => {
    try {
      // upsert so duplicates don’t error
      const ops = records.map(r => ({
        updateOne: {
          filter: { fixture_mid: r.fixture_mid },
          update: { $set: r },
          upsert: true,
        }
      }));
      await Fixture.bulkWrite(ops);
      res.json({ message: `Imported ${records.length} fixtures.` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database write failed' });
    }
  });

  // kick off parsing
  parser.write(req.file.buffer);
  parser.end();
});

// GET /api/fixtures?q=someTeam
app.get('/api/fixtures', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  // case-insensitive partial match on home or away team
  const regex = new RegExp(q, 'i');
  try {
    const fixtures = await Fixture.find({
      $or: [
        { home_team:  regex },
        { away_team:  regex }
      ]
    })
    .sort({ fixture_datetime: 1 })
    .limit(50);              // cap it for performance

    res.json(fixtures);
  } catch (err) {
    console.error('Search error', err);
    res.status(500).json({ error: 'Search failed' });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
