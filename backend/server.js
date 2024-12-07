const app = require('./src/app');
const env = require('./src/config/env');

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
