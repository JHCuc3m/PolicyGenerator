module.exports = `<ProxyEndpoint name="default">
  <PreFlow name="PreFlow">
    <Request>
      <Step>
        <Name>verify-api-key</Name>
      </Step>

      <Step>
        <Name>OAuthV2-VerifyAccessToken</Name>
      </Step>

      <Step>
        <Name>remove-query-param-apikey</Name>
      </Step>

      <Step>
        <Name>impose-quota</Name>
      </Step>

      <Step>
        <Name>OAuthV2-VerifyAccessToken</Name>
      </Step>

      <Step> 
        <Name>openAPIpolicy</Name>
      </Step>

    </Request>

    <Response>
      
      <Step>
        <Name>JSONtoXML</Name>
      </Step>

      <Step> 
        <Name>openAPIpolicy</Name>
        <Condition>(response.status.code != 200) and (response.status.code != 500)</Condition>
      </Step>

    </Response>
  </PreFlow>
  <HTTPProxyConnection>
    <BasePath>\${basePath}</BasePath>
  </HTTPProxyConnection>
  <RouteRule name="default-route">
    <TargetEndpoint>default</TargetEndpoint>
  </RouteRule>
</ProxyEndpoint>`;
