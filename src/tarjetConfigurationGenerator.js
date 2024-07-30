const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const targetEndpointTemplate = require("../templates/targetEndpointTemplate.js"); // Import the XML template

// Constants
const SWAGGER_FILE = "../swagger/petstore.yaml";
const POLICIES_DIR = "../policies/target";
const POLICY_FILE = path.join(POLICIES_DIR, "targetEndpoint.xml");

// Main function to generate and save XML policy
function main() {
  const swaggerData = loadSwaggerFile(SWAGGER_FILE);
  const targetEndpointXML = generateTargetEndpointXML(swaggerData);
  saveXMLPolicy(POLICIES_DIR, POLICY_FILE, targetEndpointXML);
  console.log(targetEndpointXML);
}

/**
 * Loads the Swagger YAML file.
 * @param {string} filePath - The path to the Swagger file.
 * @returns {object} - The parsed Swagger data.
 */
function loadSwaggerFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContents);
  } catch (err) {
    console.error(`Error reading Swagger file: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Generates the target endpoint XML configuration from the given swagger data.
 * @param {object} swaggerData - The parsed Swagger data.
 * @returns {string} - The generated target endpoint XML.
 */
function generateTargetEndpointXML(swaggerData) {
  const baseUrl = swaggerData.servers[0].url;
  let faultRulesXML = "";

  for (const path in swaggerData.paths) {
    for (const method in swaggerData.paths[path]) {
      const operation = swaggerData.paths[path][method];

      // Get defined status codes for the operation
      const definedStatusCodes = Object.keys(operation.responses).map(Number);
      // Add 200 status code if not defined
      if (!definedStatusCodes.includes(200)) {
        definedStatusCodes.push(200);
      }

      // Delete all NaN status codes
      for (let i = 0; i < definedStatusCodes.length; i++) {
        if (isNaN(definedStatusCodes[i])) {
          definedStatusCodes.splice(i, 1);
        }
      }

      const subpath = path.replace(/{[^}]+}/g, "**"); // Convert path parameters to ** wildcard

      const faultCondition = definedStatusCodes
        .map((code) => `(response.status.code != ${code})`)
        .join(" and ");

      faultRulesXML += `
    <FaultRule>
      <Step>
        <Name>RaiseFault</Name>
      </Step>
      <Condition>${faultCondition} and (proxy.pathsuffix Matches "${subpath}") and (request.verb = "${method.toUpperCase()}")</Condition>
    </FaultRule>`;
    }
  }

  return targetEndpointTemplate
    .replace("${baseUrl}", baseUrl)
    .replace("${faultRulesXML}", faultRulesXML);
}

/**
 * Ensures that all directories in the given path exist, creating them if necessary.
 * @param {string} targetDir - The target directory path.
 */
function ensureDirectoriesExist(targetDir) {
  const resolvedPath = path.resolve(targetDir);
  try {
    fs.mkdirSync(resolvedPath, { recursive: true });
    console.log(`Successfully ensured directories exist: ${resolvedPath}`);
  } catch (err) {
    console.error(`Error creating directories: ${err.message}`);
  }
}

/**
 * Saves the generated XML policy to a file.
 * @param {string} dirPath - The directory where the policy file will be saved.
 * @param {string} filePath - The path to the policy file.
 * @param {string} xmlPolicy - The generated XML policy content.
 */
function saveXMLPolicy(dirPath, filePath, xmlPolicy) {
  ensureDirectoriesExist(dirPath);
  try {
    fs.writeFileSync(filePath, xmlPolicy, "utf8");
    console.log(`Policy saved to ${filePath}`);
  } catch (err) {
    console.error(`Error saving policy file: ${err.message}`);
  }
}

// Execute the main function
main();
