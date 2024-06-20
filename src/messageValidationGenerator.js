/*

Author: Jiahao Chen 
Date: 2024-06-20
Purpose: This script generates an XML policy that validates the message parameters defined in the Swagger file (should be OpenAPI 3.0).
Version: 1.0

*/

const fs = require("fs");
const yaml = require("js-yaml");
const xmlTemplate = require("../templates/messageValidationTemplate.js"); // Import the XML template

// Read the OpenAPI YAML file
const openAPIFile = "../swagger/petstore.yaml";
const openAPIData = yaml.load(fs.readFileSync(openAPIFile, "utf8"));

// Function to generate XML Apigee Policy
function generateXMLPolicy(openAPIData) {
  // Example of extracting information from the OpenAPI data, adjust as needed
  const name = openAPIData.info.title.replace(/\s/g, ""); // Simplistic conversion to a valid XML name
  const displayName = openAPIData.info.title;
  const source = "request"; // Or "response", depending on your needs
  const oasResource = "oas://openapi.yaml"; // This should be pointing where OpenAPI data is stored in Apigee configuration, this should be OpenAPI 3.0

  // Substitute values in the XML template
  const xmlPolicy = xmlTemplate
    .replace("${name}", name)
    .replace("${displayName}", displayName)
    .replace("${source}", source)
    .replace("${oasResource}", oasResource);

  return xmlPolicy;
}

// Generate the XML policy
const xmlPolicy = generateXMLPolicy(openAPIData);

// Output the XML policy
console.log(xmlPolicy);

// Optionally, save the XML policy to a file
const policyDir = "../policies";
const policyFile = `${policyDir}/openAPIpolicy.xml`;

if (!fs.existsSync(policyDir)) {
  fs.mkdirSync(policyDir);
}

fs.writeFileSync(policyFile, xmlPolicy, "utf8");
