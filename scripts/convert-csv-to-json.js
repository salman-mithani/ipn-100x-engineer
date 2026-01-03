// Script to convert restaurants.csv to restaurants.json format
const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../data/restaurants.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

// Houston coordinates for all restaurants (since they're all in Houston)
const houstonCoordinates = {
  latitude: 29.7604,
  longitude: -95.3698
};

// Parse operating hours to extract opening and closing times
function parseOperatingHours(hoursStr) {
  // Examples:
  // "Mon-Thu: 11:30AM-2:30PM & 6:00PM-10:00PM; Fri-Sun: 11:30AM-10:30PM"
  // "Daily: 11:00AM-10:00PM"

  // Extract first time range for simplicity
  const timeMatch = hoursStr.match(/(\d{1,2}:\d{2}[AP]M)-(\d{1,2}:\d{2}[AP]M)/);

  if (timeMatch) {
    return {
      opening: convertTo24Hour(timeMatch[1]),
      closing: convertTo24Hour(timeMatch[2])
    };
  }

  return {
    opening: "11:00",
    closing: "22:00"
  };
}

// Convert 12-hour time to 24-hour format
function convertTo24Hour(time12h) {
  const [time, modifier] = [time12h.slice(0, -2), time12h.slice(-2)];
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// Parse price range
function parsePriceRange(priceStr) {
  // "$15-25" -> "$$"
  const avgPrice = parseInt(priceStr.replace(/[^0-9-]/g, '').split('-')[0]);
  if (avgPrice < 10) return '$';
  if (avgPrice < 20) return '$$';
  if (avgPrice < 30) return '$$$';
  return '$$$$';
}

// Generate random coordinates near Houston
function getHoustonCoordinates(index) {
  // Spread restaurants across Houston area
  const latVariation = (Math.random() - 0.5) * 0.2; // ~11 miles variation
  const lngVariation = (Math.random() - 0.5) * 0.2;

  return {
    latitude: parseFloat((houstonCoordinates.latitude + latVariation).toFixed(4)),
    longitude: parseFloat((houstonCoordinates.longitude + lngVariation).toFixed(4))
  };
}

const restaurants = [];

// Process each line (skip header)
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;

  // Split by comma, but be careful with commas in quoted fields
  const parts = lines[i].split(',');

  if (parts.length < 11) continue;

  const name = parts[0].trim();
  const address = parts[1].trim();
  const phone = parts[2].trim();
  const operatingHours = parts[3].trim();
  const cuisine = parts[4].trim();
  const vegetarianOptions = parts[5].trim();
  const signatureDishes = parts[6].trim();
  const priceRange = parts[7].trim();
  const rating = parseFloat(parts[8].trim());
  const website = parts[9].trim();
  const specialFeatures = parts[10].trim();

  const hours = parseOperatingHours(operatingHours);
  const coords = getHoustonCoordinates(i);

  restaurants.push({
    id: i.toString(),
    name: name,
    address: address,
    cuisine: cuisine,
    rating: rating,
    priceRange: parsePriceRange(priceRange),
    openingHours: hours.opening,
    closingHours: hours.closing,
    operatingHoursDisplay: operatingHours,
    latitude: coords.latitude,
    longitude: coords.longitude,
    phone: phone,
    description: `${specialFeatures}. Specialties: ${signatureDishes}`
  });
}

// Write to JSON file
const outputPath = path.join(__dirname, '../data/restaurants.json');
const output = {
  restaurants: restaurants
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`Converted ${restaurants.length} restaurants from CSV to JSON`);
console.log(`Output written to: ${outputPath}`);
