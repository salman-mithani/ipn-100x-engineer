const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../data/restaurants.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');

// Houston area coordinates (for mock geocoding)
const houstonCoords = {
  base: { lat: 29.7604, lng: -95.3698 },
  // Add small variations for each restaurant
};

const restaurants = [];

for (let i = 1; i < lines.length; i++) {
  // Handle CSV parsing with potential commas in fields
  const values = [];
  let current = '';
  let inQuotes = false;

  for (const char of lines[i]) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  const [
    name,
    address,
    phone,
    operatingHours,
    cuisine,
    vegetarianOptions,
    signatureDishes,
    priceRange,
    rating,
    website,
    specialFeatures
  ] = values;

  // Parse price range to $ format
  const priceMatch = priceRange.match(/\$(\d+)-(\d+)/);
  let priceSymbol = '$$';
  if (priceMatch) {
    const avgPrice = (parseInt(priceMatch[1]) + parseInt(priceMatch[2])) / 2;
    if (avgPrice <= 10) priceSymbol = '$';
    else if (avgPrice <= 20) priceSymbol = '$$';
    else if (avgPrice <= 35) priceSymbol = '$$$';
    else priceSymbol = '$$$$';
  }

  // Extract simple opening/closing times from operating hours
  // e.g., "Daily: 11:00AM-10:00PM" -> openingHours: "11:00", closingHours: "22:00"
  let openingHours = '11:00';
  let closingHours = '22:00';

  const timeMatch = operatingHours.match(/(\d{1,2}):?(\d{2})?(AM|PM)-(\d{1,2}):?(\d{2})?(AM|PM)/i);
  if (timeMatch) {
    let openHour = parseInt(timeMatch[1]);
    const openMin = timeMatch[2] || '00';
    const openAmPm = timeMatch[3].toUpperCase();

    let closeHour = parseInt(timeMatch[4]);
    const closeMin = timeMatch[5] || '00';
    const closeAmPm = timeMatch[6].toUpperCase();

    // Convert to 24-hour format
    if (openAmPm === 'PM' && openHour !== 12) openHour += 12;
    if (openAmPm === 'AM' && openHour === 12) openHour = 0;
    if (closeAmPm === 'PM' && closeHour !== 12) closeHour += 12;
    if (closeAmPm === 'AM' && closeHour === 12) closeHour = 0;

    openingHours = `${openHour.toString().padStart(2, '0')}:${openMin}`;
    closingHours = `${closeHour.toString().padStart(2, '0')}:${closeMin}`;
  }

  // Generate pseudo-random coordinates around Houston
  const latOffset = (Math.sin(i * 1.5) * 0.05);
  const lngOffset = (Math.cos(i * 1.5) * 0.05);

  restaurants.push({
    id: String(i),
    name: name,
    address: address,
    cuisine: cuisine,
    rating: parseFloat(rating) || 4.0,
    priceRange: priceSymbol,
    openingHours: openingHours,
    closingHours: closingHours,
    operatingHours: operatingHours,
    latitude: houstonCoords.base.lat + latOffset,
    longitude: houstonCoords.base.lng + lngOffset,
    phone: phone,
    description: specialFeatures || `${cuisine} restaurant featuring ${signatureDishes}`,
    vegetarianOptions: vegetarianOptions,
    signatureDishes: signatureDishes,
    website: website !== 'N/A' ? website : undefined
  });
}

// Write to JSON file
const outputPath = path.join(__dirname, '../data/restaurants.json');
const output = { restaurants };

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`Converted ${restaurants.length} restaurants to JSON`);
console.log('Output written to:', outputPath);
