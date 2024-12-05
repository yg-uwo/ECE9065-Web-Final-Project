const app = require('./src/app');
const env = require('./src/config/env');


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
