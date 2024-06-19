const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

let numberStorage = [];

app.get('/numbers/:numberid', async (req, res) => {
  const numberType = req.params.numberid;

  let apiUrl;
  switch (numberType) {
    case 'p':
      apiUrl = 'http://20.244.56.144/test/primes';
      break;
    case 'f':
      apiUrl = 'http://20.244.56.144/test/fibo';
      break;
    case 'e':
      apiUrl = 'http://20.244.56.144/test/even';
      break;
    case 'r':
      apiUrl = 'http://20.244.56.144/test/rand';
      break;
    default:
      return res.status(400).json({ error: 'Invalid number ID' });
  }

  try {
    const response = await axios.get(apiUrl);
    const newNumbers = response.data.numbers;

    const windowPrevState = [...numberStorage];

    numberStorage = [...numberStorage, ...newNumbers].slice(-WINDOW_SIZE);

    const windowCurrState = [...numberStorage];
    const avg = numberStorage.reduce((acc, num) => acc + num, 0) / numberStorage.length;

    res.json({
      windowPrevState,
      windowCurrState,
      numbers: newNumbers,
      avg: avg.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch numbers from third-party server' });
  }
});

app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});