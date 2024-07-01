// RaiseFaultGenerator.js
const fs = require("fs");
const yaml = require("js-yaml");
const xmlTemplate = require("../templates/RaiseFaultTemplate.js"); // Import the XML template

// Read the Swagger YAML file
const swaggerFile = "../swagger/petstore.yaml";
const swaggerData = yaml.load(fs.readFileSync(swaggerFile, "utf8"));

// Function to generate XML policy
function generateXMLPolicy(swaggerData) {
  // Extract data from the swaggerData as needed
  const name = "CustomRaiseFault";
  const displayName = "Custom RaiseFault Policy";
  const statusCode = "404";
  const reasonPhrase = "Not Found";
  const ignoreUnresolvedVariables = "true";

  // Substitute the values in the XML template
  const xmlPolicy = xmlTemplate
    .replace("${name}", name)
    .replace("${displayName}", displayName)
    .replace("${statusCode}", statusCode)
    .replace("${reasonPhrase}", reasonPhrase)
    .replace("${ignoreUnresolvedVariables}", ignoreUnresolvedVariables);

  return xmlPolicy;
}

// Generate the XML policy
const xmlPolicy = generateXMLPolicy(swaggerData);

// Output the XML policy
console.log(xmlPolicy);

// Optionally, save the XML policy to a file
const policiesDir = "../policies";

// Create the policies directory if it does not exist
if (!fs.existsSync(policiesDir)) {
  fs.mkdirSync(policiesDir);
}

// Define the file path for the XML policy
const xmlPolicyFilePath = `${policiesDir}/RaiseFault.xml`;

// Write the XML policy to the file
fs.writeFileSync(xmlPolicyFilePath, xmlPolicy, "utf8");
