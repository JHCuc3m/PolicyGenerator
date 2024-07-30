module.exports = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<TargetEndpoint name="default">
  <HTTPTargetConnection>
    <URL>\${baseUrl}</URL>
  </HTTPTargetConnection>
  <FaultRules>
    \${faultRulesXML}
  </FaultRules>
</TargetEndpoint>`;
