const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const xmlTemplate = require("../templates/proxyConfigurationTemplate"); // Import the XML template

// Constants
const SWAGGER_FILE = "../swagger/petstore.yaml";
const POLICIES_DIR = "../policies/proxy";
const POLICY_FILE = path.join(POLICIES_DIR, "default.xml");

// Main function to generate and save XML policy
function main() {
  const swaggerData = loadSwaggerFile(SWAGGER_FILE);
  const basePath = extractBasePath(swaggerData);
  const xmlPolicy = generateXMLPolicy(basePath);
  saveXMLPolicy(POLICIES_DIR, POLICY_FILE, xmlPolicy);
  console.log(xmlPolicy);
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
 * Extracts base path from the Swagger data.
 * @param {object} swaggerData - The parsed Swagger data.
 * @returns {string} - The base path.
 */
function extractBasePath(swaggerData) {
  const servers = swaggerData.servers || [];
  if (servers.length > 0) {
    const url = new URL(servers[0].url);
    return url.pathname;
  }
  return "/";
}

/**
 * Generates the XML policy from the given base path.
 * @param {string} basePath - The base path.
 * @returns {string} - The generated XML policy.
 */
function generateXMLPolicy(basePath) {
  return xmlTemplate.replace("${basePath}", basePath);
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
