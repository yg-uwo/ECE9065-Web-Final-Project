const app = require('./src/app');
const env = require('./src/config/env');

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
