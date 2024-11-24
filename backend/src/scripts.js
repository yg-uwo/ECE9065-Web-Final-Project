const { MongoClient } = require('mongodb');

// Replace the following with your MongoDB connection details
const MONGO_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'computer_ecom';
const COLLECTION_NAME = 'carts';

// Sample data to insert into the collection
const data = [
  { productId: 'P001', productName: 'MacBook Pro 2021', type: 'Laptop', quantity: 10 },
  { productId: 'P002', productName: 'Dell XPS 13', type: 'Laptop', quantity: 15 },
  { productId: 'P003', productName: 'HP Spectre x360', type: 'Laptop', quantity: 8 },
  { productId: 'P004', productName: 'Logitech MX Master 3', type: 'Mouse', quantity: 20 },
  { productId: 'P005', productName: 'Apple Magic Keyboard', type: 'Keyboard', quantity: 12 },
  { productId: 'P006', productName: 'Lenovo ThinkPad X1 Carbon', type: 'Laptop', quantity: 5 },
  { productId: 'P007', productName: 'Asus ROG Strix', type: 'Laptop', quantity: 7 },
  { productId: 'P008', productName: 'Corsair K95 RGB', type: 'Keyboard', quantity: 18 },
  { productId: 'P009', productName: 'Razer DeathAdder V2', type: 'Mouse', quantity: 25 },
  { productId: 'P010', productName: 'Microsoft Surface Laptop 4', type: 'Laptop', quantity: 6 },
  { productId: 'P011', productName: 'Dell Inspiron 15', type: 'Laptop', quantity: 14 },
  { productId: 'P012', productName: 'HP Pavilion 15', type: 'Laptop', quantity: 10 },
  { productId: 'P013', productName: 'SteelSeries Apex Pro', type: 'Keyboard', quantity: 9 },
  { productId: 'P014', productName: 'Logitech MX Keys', type: 'Keyboard', quantity: 15 },
  { productId: 'P015', productName: 'Asus ZenBook 14', type: 'Laptop', quantity: 8 },
  { productId: 'P016', productName: 'Razer Blade 15', type: 'Laptop', quantity: 5 },
  { productId: 'P017', productName: 'Apple Magic Mouse', type: 'Mouse', quantity: 20 },
  { productId: 'P018', productName: 'Lenovo Legion 5', type: 'Laptop', quantity: 11 },
  { productId: 'P019', productName: 'Dell Alienware m15', type: 'Laptop', quantity: 4 },
  { productId: 'P020', productName: 'HyperX Alloy Elite 2', type: 'Keyboard', quantity: 10 }
];

async function insertData() {
  let client;
  try {
    // Connect to the MongoDB server
    client = new MongoClient(MONGO_URI);
    await client.connect();

    console.log('Connected successfully to MongoDB');

    // Access the database and collection
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Insert data into the collection
    const result = await collection.insertMany(data);

    // Print the inserted IDs
    console.log('Data inserted successfully. Inserted IDs:', result.insertedIds);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB closed');
    }
  }
}

// Run the function
insertData();
