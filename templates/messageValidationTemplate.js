module.exports = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OASValidation continueOnError="false" enabled="true" name=\${name}>
    <DisplayName>\${displayName}</DisplayName>
    <Properties/>
    <Source>\${source}</Source>
    <Options>
        <ValidateMessageBody>true</ValidateMessageBody>
    </Options>
    <OASResource>\${oasResource}</OASResource>
</OASValidation>`;
