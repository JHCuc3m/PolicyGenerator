/*

Author: Jiahao Chen 
Date: 2024-06-13
Purpose: This script generates an XML policy that contains all the scopes defined in the Swagger file.
Version: 1.0

*/

const fs = require("fs");
const yaml = require("js-yaml");
const xmlTemplate = require("../templates/scopeTemplate.js"); // Import the XML template

// Read the Swagger YAML file
const swaggerFile = "../swagger/petstore.yaml";
const swaggerData = yaml.load(fs.readFileSync(swaggerFile, "utf8"));

// Function to generate XML policy
function generateXMLPolicy(swaggerData) {
  // Extract scopes from the security definitions
  const securitySchemes = swaggerData.components.securitySchemes;
  let scopes = [];

  for (const scheme in securitySchemes) {
    if (securitySchemes[scheme].type === "oauth2") {
      const flows = securitySchemes[scheme].flows;
      for (const flow in flows) {
        scopes = scopes.concat(Object.keys(flows[flow].scopes));
      }
    }
  }

  // Join scopes with a space
  const scopeString = scopes.join(" ");

  // Substitute the scopeString in the XML template
  const xmlPolicy = xmlTemplate.replace("${scopeString}", scopeString);

  return xmlPolicy;
}

// Generate the XML policy
const xmlPolicy = generateXMLPolicy(swaggerData);

// Output the XML policy
console.log(xmlPolicy);

// Optionally, save the XML policy to a file
//Create file if does not exist
if (!fs.existsSync("../policies")) {
  fs.mkdirSync("../policies");
}

if (!fs.existsSync("../policies/scope.xml")) {
  fs.writeFileSync("../policies/scope.xml", "", "utf8");
}

fs.writeFileSync("../policies/scope.xml", xmlPolicy, "utf8");
