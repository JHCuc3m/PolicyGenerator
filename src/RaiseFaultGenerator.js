// RaiseFaultGenerator.js
const fs = require("fs");
const path = require("path");

const yaml = require("js-yaml");
const xmlTemplate = require("../templates/RaiseFaultTemplate.js"); // Import the XML template

// Read the Swagger YAML file
const swaggerFile = "../swagger/petstore.yaml";
const swaggerData = yaml.load(fs.readFileSync(swaggerFile, "utf8"));

// Function to generate XML policy
function generateXMLPolicy(
  swaggerData,
  name,
  displayName,
  statusCode,
  reasonPhrase,
  ignoreUnresolvedVariables
) {
  // Substitute the values in the XML template
  const xmlPolicy = xmlTemplate
    .replace(/\${name}/g, name)
    .replace(/\${displayName}/g, displayName)
    .replace(/\${statusCode}/g, statusCode)
    .replace(/\${reasonPhrase}/g, reasonPhrase)
    .replace(/\${ignoreUnresolvedVariables}/g, ignoreUnresolvedVariables);

  return xmlPolicy;
}

/**
 * Ensures that all directories in the given path exist, creating them if necessary.
 * @param {string} targetDir - The target directory path.
 */

function ensureDirectoriesExist(targetDir) {
  // Resolve the target directory path to an absolute path
  const resolvedPath = path.resolve(targetDir);

  // Create the directory recursively if it does not exist
  try {
    fs.mkdirSync(resolvedPath, { recursive: true });
    console.log(`Successfully ensured directories exist: ${resolvedPath}`);
  } catch (err) {
    console.error(`Error creating directories: ${err.message}`);
  }
}

/**
 * Deletes the specified directory and all its contents.
 * @param {string} targetDir - The directory to delete.
 */
function deleteDirectory(targetDir) {
  // Resolve the target directory path to an absolute path
  const resolvedPath = path.resolve(targetDir);

  try {
    fs.rmSync(resolvedPath, { recursive: true, force: true });
    console.log(`Successfully deleted directory: ${resolvedPath}`);
  } catch (err) {
    console.error(`Error deleting directory: ${err.message}`);
  }
}

// Extract custom errors from Swagger data
function extractCustomErrors(swaggerData) {
  const customErrors = [];
  for (const path in swaggerData.paths) {
    const methods = swaggerData.paths[path];
    for (const method in methods) {
      const responses = methods[method].responses;
      for (const statusCode in responses) {
        if (statusCode >= 400 && statusCode < 600) {
          const description = responses[statusCode].description || "";
          customErrors.push({
            name: `${path}/${method}/${statusCode}`,
            displayName: `${path}/${method}/${statusCode}`,
            method_path: `${path}/${method}`,
            statusCode: statusCode,
            reasonPhrase: description,
            ignoreUnresolvedVariables: "true",
          });
        }
      }
    }
  }
  return customErrors;
}

// Generate the XML policies
const customErrors = extractCustomErrors(swaggerData);
const policiesDir = "../policies/raiseFaults";

// Create the policies directory if it does not exist
if (!fs.existsSync(policiesDir)) {
  fs.mkdirSync(policiesDir);
}

// Empty the directory
deleteDirectory(policiesDir);

// Generate and save each custom error policy
customErrors.forEach((error) => {
  const xmlPolicy = generateXMLPolicy(
    swaggerData,
    error.name,
    error.displayName,
    error.statusCode,
    error.reasonPhrase,
    error.ignoreUnresolvedVariables
  );

  //Create subdirectory if does not exist
  ensureDirectoriesExist(`${policiesDir}/${error.method_path}`);

  const xmlPolicyFilePath = `${policiesDir}/${error.displayName}.xml`;
  fs.writeFileSync(xmlPolicyFilePath, xmlPolicy, "utf8");
  console.log(`Generated policy: ${xmlPolicyFilePath}`);
});
