const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const xmlTemplate = require("../templates/messageValidationTemplate.js"); // Import the XML template

// Constants
const OPENAPI_FILE = "../swagger/petstore.yaml";
const POLICY_DIR = "../policies";
const POLICY_FILE = path.join(POLICY_DIR, "openAPIpolicy.xml");

// Main function to generate and save the XML policy
function main() {
  const openAPIData = loadOpenAPIFile(OPENAPI_FILE);
  const xmlPolicy = generateXMLPolicy(openAPIData);
  saveXMLPolicy(POLICY_DIR, POLICY_FILE, xmlPolicy);
  console.log(xmlPolicy);
}

/**
 * Loads the OpenAPI YAML file.
 * @param {string} filePath - The path to the OpenAPI file.
 * @returns {object} - The parsed OpenAPI data.
 */
function loadOpenAPIFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContents);
  } catch (err) {
    console.error(`Error reading OpenAPI file: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Generates the XML policy from OpenAPI data.
 * @param {object} openAPIData - The parsed OpenAPI data.
 * @returns {string} - The generated XML policy.
 */
function generateXMLPolicy(openAPIData) {
  const name = openAPIData.info.title.replace(/\s/g, ""); // Simplistic conversion to a valid XML name
  const displayName = openAPIData.info.title;
  const source = "request"; // Or "response", depending on your needs
  const oasResource = "oas://openapi.yaml"; // This should be pointing where OpenAPI data is stored in Apigee configuration

  // Substitute values in the XML template
  return xmlTemplate
    .replace("${name}", name)
    .replace("${displayName}", displayName)
    .replace("${source}", source)
    .replace("${oasResource}", oasResource);
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
