const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const xmlTemplate = require("../templates/scopeTemplate.js"); // Import the XML template

// Constants
const SWAGGER_FILE = "../swagger/petstore.yaml";
const POLICIES_DIR = "../policies";
const POLICY_FILE = path.join(POLICIES_DIR, "scope.xml");

// Main function to generate and save XML policy
function main() {
  const swaggerData = loadSwaggerFile(SWAGGER_FILE);
  const scopes = extractScopes(swaggerData);
  const xmlPolicy = generateXMLPolicy(scopes);
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
 * Extracts scopes from the Swagger data.
 * @param {object} swaggerData - The parsed Swagger data.
 * @returns {array} - An array of scopes.
 */
function extractScopes(swaggerData) {
  const scopes = [];
  const securitySchemes = swaggerData.components.securitySchemes || {};

  for (const scheme in securitySchemes) {
    if (securitySchemes[scheme].type === "oauth2") {
      const flows = securitySchemes[scheme].flows || {};
      for (const flow in flows) {
        scopes.push(...Object.keys(flows[flow].scopes || {}));
      }
    }
  }

  return scopes;
}

/**
 * Generates the XML policy from the given scopes.
 * @param {array} scopes - An array of scopes.
 * @returns {string} - The generated XML policy.
 */
function generateXMLPolicy(scopes) {
  const scopeString = scopes.join(" ");
  return xmlTemplate.replace("${scopeString}", scopeString);
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
