const fs = require("fs")
const yargs = require("yargs")

// Parse command line arguments using yargs
const argv = yargs
  .command("add-contributor", "Add a contributor to the JSON file", {
    name: {
      description: "Contributor name",
      demandOption: true,
      alias: "n",
    },
    contributions: {
      description: "Contributions (comma-separated)",
      demandOption: true,
      alias: "c",
    },
    image: {
      description: "Contributor image",
      demandOption: false,
      alias: "i",
    },
  })
  .help().argv

const jsonFileName = ".all-contributorsrc" //file json to modify

const defaultAvatarUrl = "https://www.gravatar.com/avatar"

// Read the existing JSON data from the file
let jsonData = {}
try {
  const jsonContent = fs.readFileSync(jsonFileName, "utf8")
  jsonData = JSON.parse(jsonContent)
} catch (err) {
  console.error("Error reading JSON file:", err)
  process.exit(1)
}

// Create a new contributor object
const newContributor = {
  login: "",
  name: argv.name,
  avatar_url: argv.image ?? defaultAvatarUrl,
  contributions: argv.contributions
    .split(",")
    .map(contribution => contribution.trim()),
}

// Append the new contributor to the existing data
jsonData["contributors"].push(newContributor)

// Write the updated data back to the file
try {
  fs.writeFileSync(jsonFileName, JSON.stringify(jsonData, null, 2))
  console.log("Contributor added successfully.")
} catch (err) {
  console.error("Error writing JSON file:", err)
  process.exit(1)
}
