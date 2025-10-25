// MongoDB Seed Script for Real Estate CMS
// Run with: mongosh <database_name> seed-mongodb.js



// Clear existing collections
db.amenities.deleteMany({});
// db.users.deleteMany({});
db.admins.deleteMany({});
db.properties.deleteMany({});
db.messages.deleteMany({});
db.media.deleteMany({});
db['payload-preferences'].deleteMany({});
db['payload-migrations'].deleteMany({});

print('🗑️  Cleared existing data\n');

// ===========================================
// 1. CREATE AMENITIES
// ===========================================
print('Creating amenities...');

const amenities = [
  { _id: ObjectId(), name: 'Swimming Pool', icon: '🏊', createdAt: new Date(), updatedAt: new Date() },
  { _id: ObjectId(), name: 'Gym', icon: '💪', createdAt: new Date(), updatedAt: new Date() },
  { _id: ObjectId(), name: 'Parking', icon: '🚗', createdAt: new Date(), updatedAt: new Date() },
  { _id: ObjectId(), name: 'Garden', icon: '🌳', createdAt: new Date(), updatedAt: new Date() },
  { _id: ObjectId(), name: 'Balcony', icon: '🏡', createdAt: new Date(), updatedAt: new Date() },
  { _id: ObjectId(), name: 'Air Conditioning', icon: '❄️', createdAt: new Date(), updatedAt: new Date() },
  { _id: ObjectId(), name: 'Security', icon: '🔒', createdAt: new Date(), updatedAt: new Date() },
  { _id: ObjectId(), name: 'Elevator', icon: '🛗', createdAt: new Date(), updatedAt: new Date() },
  { _id: ObjectId(), name: 'Pet Friendly', icon: '🐕', createdAt: new Date(), updatedAt: new Date() },
  { _id: ObjectId(), name: 'Fireplace', icon: '🔥', createdAt: new Date(), updatedAt: new Date() },
];

db.amenities.insertMany(amenities);
print(`✅ Created ${amenities.length} amenities\n`);

// ===========================================
// 2. CREATE ADMIN
// ===========================================
print('Creating admin...');

const admin = {
  _id: ObjectId(),
  name: 'Admin User',
  email: 'admin@realestate.com',
  // Password: admin123 (you'll need to hash this with bcrypt when actually using)
  password: '$2a$10$XqKzK5Z5Z5Z5Z5Z5Z5Z5Z.EXAMPLEBCRYPTHASH',
  createdAt: new Date(),
  updatedAt: new Date(),
};

db.admins.insertOne(admin);
print('✅ Created admin user\n');

// ===========================================
// 3. CREATE BUYERS
// ===========================================
print('Creating buyers...');

const buyers = [
  {
    _id: ObjectId(),
    name: 'John Doe',
    email: 'john.buyer@example.com',
    password: '$2a$10$XqKzK5Z5Z5Z5Z5Z5Z5Z5Z.EXAMPLEBCRYPTHASH', // buyer123
    phone: '+1-555-0101',
    role: 'buyer',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: 'Sarah Wilson',
    email: 'sarah.buyer@example.com',
    password: '$2a$10$XqKzK5Z5Z5Z5Z5Z5Z5Z5Z.EXAMPLEBCRYPTHASH', // buyer123
    phone: '+1-555-0102',
    role: 'buyer',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: 'Michael Chen',
    email: 'michael.buyer@example.com',
    password: '$2a$10$XqKzK5Z5Z5Z5Z5Z5Z5Z5Z.EXAMPLEBCRYPTHASH', // buyer123
    phone: '+1-555-0103',
    role: 'buyer',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

db.users.insertMany(buyers);
print(`✅ Created ${buyers.length} buyers\n`);

// ===========================================
// 4. CREATE SELLERS
// ===========================================
print('Creating sellers...');

const sellers = [
  {
    _id: ObjectId(),
    name: 'Emily Rodriguez',
    email: 'emily.seller@example.com',
    password: '$2a$10$XqKzK5Z5Z5Z5Z5Z5Z5Z5Z.EXAMPLEBCRYPTHASH', // seller123
    phone: '+1-555-0201',
    role: 'seller',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: 'David Thompson',
    email: 'david.seller@example.com',
    password: '$2a$10$XqKzK5Z5Z5Z5Z5Z5Z5Z5Z.EXAMPLEBCRYPTHASH', // seller123
    phone: '+1-555-0202',
    role: 'seller',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: 'Lisa Anderson',
    email: 'lisa.seller@example.com',
    password: '$2a$10$XqKzK5Z5Z5Z5Z5Z5Z5Z5Z.EXAMPLEBCRYPTHASH', // seller123
    phone: '+1-555-0203',
    role: 'seller',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

db.users.insertMany(sellers);
print(`✅ Created ${sellers.length} sellers\n`);

// ===========================================
// 5. CREATE PROPERTIES
// ===========================================
print('Creating properties...');

const properties = [
  // Seller 1 Properties (Emily)
  {
    _id: ObjectId(),
    title: 'Modern Downtown Apartment',
    description: 'Beautiful 2-bedroom apartment in the heart of downtown. Walking distance to shops, restaurants, and public transit. Newly renovated with high-end finishes.',
    price: 450000,
    location: 'Downtown, New York, NY',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    amenities: [amenities[0]._id, amenities[2]._id, amenities[4]._id, amenities[5]._id, amenities[7]._id],
    postedBy: sellers[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: 'Luxury Penthouse Suite',
    description: 'Stunning penthouse with panoramic city views. 3 bedrooms, 3 bathrooms, floor-to-ceiling windows, and a private rooftop terrace.',
    price: 1250000,
    location: 'Upper East Side, New York, NY',
    propertyType: 'condo',
    bedrooms: 3,
    bathrooms: 3,
    size: 2500,
    amenities: [amenities[0]._id, amenities[1]._id, amenities[2]._id, amenities[4]._id, amenities[6]._id, amenities[7]._id],
    postedBy: sellers[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Seller 2 Properties (David)
  {
    _id: ObjectId(),
    title: 'Suburban Family Home',
    description: 'Spacious 4-bedroom house perfect for families. Large backyard, modern kitchen, finished basement, and attached 2-car garage.',
    price: 625000,
    location: 'Westchester, NY',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 3,
    size: 3200,
    amenities: [amenities[2]._id, amenities[3]._id, amenities[5]._id, amenities[6]._id, amenities[8]._id, amenities[9]._id],
    postedBy: sellers[1]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: 'Cozy Studio Apartment',
    description: 'Perfect starter home or investment property. Recently updated studio with modern appliances and efficient layout.',
    price: 225000,
    location: 'Brooklyn, NY',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    size: 550,
    amenities: [amenities[2]._id, amenities[5]._id, amenities[6]._id],
    postedBy: sellers[1]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: 'Prime Development Land',
    description: '5-acre lot in rapidly growing area. Zoned for residential development. Utilities available at street.',
    price: 750000,
    location: 'Hudson Valley, NY',
    propertyType: 'land',
    size: 217800,
    amenities: [],
    postedBy: sellers[1]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Seller 3 Properties (Lisa)
  {
    _id: ObjectId(),
    title: 'Waterfront Condo',
    description: 'Breathtaking water views from every room. 2 bedrooms, 2 bathrooms, with access to resort-style amenities including pool, gym, and marina.',
    price: 895000,
    location: 'Battery Park, New York, NY',
    propertyType: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    size: 1800,
    amenities: [amenities[0]._id, amenities[1]._id, amenities[2]._id, amenities[4]._id, amenities[6]._id, amenities[7]._id],
    postedBy: sellers[2]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: 'Historic Brownstone',
    description: 'Beautifully restored 19th-century brownstone. 5 bedrooms, original architectural details, modern updates throughout.',
    price: 2100000,
    location: 'Park Slope, Brooklyn, NY',
    propertyType: 'house',
    bedrooms: 5,
    bathrooms: 4,
    size: 4500,
    amenities: [amenities[2]._id, amenities[3]._id, amenities[5]._id, amenities[9]._id],
    postedBy: sellers[2]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: 'Garden Level Apartment',
    description: 'Charming 1-bedroom with private garden access. Perfect for nature lovers seeking city convenience.',
    price: 385000,
    location: 'Queens, NY',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    size: 850,
    amenities: [amenities[2]._id, amenities[3]._id, amenities[5]._id, amenities[8]._id],
    postedBy: sellers[2]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

db.properties.insertMany(properties);
print(`✅ Created ${properties.length} properties\n`);

// ===========================================
// 6. CREATE MESSAGES
// ===========================================
print('Creating messages...');

const messages = [
  {
    _id: ObjectId(),
    sender: buyers[0]._id,
    receiver: sellers[0]._id,
    property: properties[0]._id,
    messageText: "Hi! I'm very interested in the Modern Downtown Apartment. Is it still available? I'd love to schedule a viewing.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    sender: sellers[0]._id,
    receiver: buyers[0]._id,
    property: properties[0]._id,
    messageText: "Hello John! Yes, it's still available. I can show it to you this weekend. What day works best for you?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    sender: buyers[1]._id,
    receiver: sellers[1]._id,
    property: properties[2]._id,
    messageText: "Hi David, we're a family of four looking for a house in Westchester. Your property looks perfect! Can you tell me more about the school district?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    sender: sellers[1]._id,
    receiver: buyers[1]._id,
    property: properties[2]._id,
    messageText: "Hi Sarah! The house is in an excellent school district - top-rated elementary and high schools. Happy to provide more details. Would you like to visit?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    sender: buyers[2]._id,
    receiver: sellers[2]._id,
    property: properties[5]._id,
    messageText: 'The waterfront condo looks amazing! What are the monthly HOA fees? And is there any flexibility on the price?',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    sender: buyers[0]._id,
    receiver: sellers[0]._id,
    property: properties[1]._id,
    messageText: "The penthouse is stunning! What's included in the sale? Are the furnishings negotiable?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    sender: buyers[1]._id,
    receiver: sellers[1]._id,
    property: properties[3]._id,
    messageText: "I'm looking for an investment property. What's the rental history for this studio apartment?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    sender: buyers[2]._id,
    receiver: sellers[2]._id,
    property: properties[6]._id,
    messageText: "The brownstone is beautiful! Has there been any recent renovation work done? What's the condition of the roof and plumbing?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

db.messages.insertMany(messages);
print(`✅ Created ${messages.length} messages\n`);

// ===========================================
// SUMMARY
// ===========================================
print('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
print('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

print('📋 Test Accounts Created:');
print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
print('Admin:');
print('  Email: admin@realestate.com');
print('  Password: admin123');
print('\nBuyers:');
print('  Email: john.buyer@example.com | Password: buyer123');
print('  Email: sarah.buyer@example.com | Password: buyer123');
print('  Email: michael.buyer@example.com | Password: buyer123');
print('\nSellers:');
print('  Email: emily.seller@example.com | Password: seller123');
print('  Email: david.seller@example.com | Password: seller123');
print('  Email: lisa.seller@example.com | Password: seller123');
print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

print('📊 Data Summary:');
print(`  • ${amenities.length} Amenities`);
print(`  • 1 Admin`);
print(`  • ${buyers.length} Buyers`);
print(`  • ${sellers.length} Sellers`);
print(`  • ${properties.length} Properties`);
print(`  • ${messages.length} Messages\n`);

print('⚠️  NOTE: Passwords are placeholder hashes.');
print('   Run the Payload seed script to get properly hashed passwords.\n');