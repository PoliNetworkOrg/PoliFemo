const fs = require('fs');

// Read the content of .all-contributors file
const allContributorsContent = fs.readFileSync('.all-contributorsrc', 'utf-8');
const allContributorsData = JSON.parse(allContributorsContent);

// Extract the 'contributors' field
const contributors = allContributorsData.contributors || [];

// Write the contributors to contributors.json
fs.writeFileSync('./src/pages/settings/contributors/contributors.json', JSON.stringify(contributors, null, 2));

console.log('contributors.json updated successfully.');
