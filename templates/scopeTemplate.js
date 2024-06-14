// xmlScope Template.js
const xmlScopeTemplate = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OAuthV2 async="false" continueOnError="false" enabled="true" name="OAuthV2-VerifyAccessToken">
  <DisplayName>OAuth v2 Verify Access Token</DisplayName>
  <Operation>VerifyAccessToken</Operation>
  <ExternalAuthorization>false</ExternalAuthorization>
  <AccessToken>{request.queryparam.access_token}</AccessToken>
  <Scope>\${scopeString}</Scope>
  <GenerateResponse enabled="true"/>
</OAuthV2>`;

module.exports = xmlScopeTemplate;
