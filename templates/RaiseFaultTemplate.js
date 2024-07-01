// RaiseFaultTemplate.js
module.exports = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<RaiseFault async="false" continueOnError="false" enabled="true" name="\${name}">
    <DisplayName>\${displayName}</DisplayName>
    <Properties/>
    <FaultResponse>
        <Set>
            <Headers/>
            <Payload contentType="text/plain"/>
            <StatusCode>\${statusCode}</StatusCode>
            <ReasonPhrase>\${reasonPhrase}</ReasonPhrase>
        </Set>
    </FaultResponse>
    <IgnoreUnresolvedVariables>\${ignoreUnresolvedVariables}</IgnoreUnresolvedVariables>
</RaiseFault>`;
