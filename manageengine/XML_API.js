  /**
  * POST Mechanism updated to support XML. Log statements printing JSON.stringify removed to prevent exceptions thrown
  */


XML_API = {};

var WEB_SERVICE_URL;
var INITIATOR;
var PASSWORD;

(function(){
  var javaPkgs = new JavaImporter(
      java.io.File,
      java.io.FileReader,
      com.alarmpoint.integrationagent.script.api,
      com.alarmpoint.integrationagent.security,
      com.alarmpoint.integrationagent.exceptions.retriable,
      com.alarmpoint.integrationagent.config.IAConfigImpl,
      com.alarmpoint.integrationagent.config.xml.IAConfigFileImpl
  );

  /**
  * Path to IA configuration file
  */
  XML_API.IA_CONFIG_FILE_PATH = "conf/IAConfig.xml";
  
  /**
  * If true, will automatically use the proxy configuration (if any) defined in the IAConfig.xml.
  * Requires an Integration Agent version that supports proxy configuration through IAConfig.xml.
  */
  XML_API.AUTOCONFIGURE_PROXY = true;

  with (javaPkgs) {
    var httpClient = new IntegrationServiceHttpClient();
    XML_API.http = httpClient;

    XML_API.decryptFile = function(path) {
      return EncryptionUtils.decrypt(new java.io.File(path));
    }

    XML_API.post = function(jsonStr, url, username, password, headers) {
      return execute('POST', jsonStr, url, username, password, headers);
    }

    XML_API.put = function(jsonStr, url, username, password, headers) {
      if (url === undefined) {
        throw 'The parameter "url" needs to be defined for the function "put".';
      }
      return execute('PUT', jsonStr, url, username, password, headers);
    }

    XML_API.patch = function(jsonStr, url, username, password, headers) {
      if (url === undefined) {
        throw 'The parameter "url" needs to be defined for the function "patch".';
      }
      return execute('PATCH', jsonStr, url, username, password, headers);
    }

    XML_API.get = function(url, username, password, headers) {
      if (url === undefined) {
        throw 'The parameter "url" needs to be defined for the function "get".';
      }
      return execute('GET', null, url, username, password, headers);
    }

    XML_API.delete = function(url, username, password, headers) {
      if (url === undefined) {
        throw 'The parameter "url" needs to be defined for the function "delete".';
      }
      return execute('DELETE', null, url, username, password, headers);
    }

    function execute(method, jsonStr, url, username, password, headers) {
      IALOG.debug("\tEntering XML_API.execute with method: {0}, jsonStr: {1}, and url: {2}", method, jsonStr, url );
      var urL = url === undefined ? WEB_SERVICE_URL : url,
            user = username === undefined ? INITIATOR : username,
            pwd = password === undefined ? XML_API.decryptFile(PASSWORD) : password;

      if ( XML_API.AUTOCONFIGURE_PROXY && XML_API.iaConfig == null )  {
        IALOG.debug("Reading configuration file: " + XML_API.IA_CONFIG_FILE_PATH);
        var configFile = new File(XML_API.IA_CONFIG_FILE_PATH);
        var iaConfigFile = new IAConfigFileImpl(new FileReader(configFile));
        XML_API.iaConfig = new IAConfigImpl(iaConfigFile, configFile.getParentFile(), configFile.toURI());
      }

      XML_API.http.setUrl(urL);

      if (user != null) {
        XML_API.http.setCredentials(user, pwd);
      }
      
      // Note: Proxy must be configured after credentials in order to support keeping the connection open
      // (See IntegrationServiceHttpClient setProxy)
      if (XML_API.AUTOCONFIGURE_PROXY && XML_API.iaConfig.getProxyConfig().isProxyEnabled()) {
        if (XML_API.proxyConfig == null) {
          IALOG.debug("Reading proxy configuration...");
          XML_API.proxyConfig = XML_API.iaConfig.getProxyConfig();
        }
        var proxyHost = XML_API.proxyConfig.getHost();
        var proxyPort = XML_API.proxyConfig.getPort(); 
        var proxyUsername = XML_API.proxyConfig.getUsername();
        var proxyPassword = XML_API.proxyConfig.getPassword(); 
        var proxyNtlmDomain = XML_API.proxyConfig.getNtlmDomain();
        IALOG.debug("Adding the following proxy parameters: {0}:{1} {2}/{3} {4}", proxyHost, proxyPort, proxyUsername, proxyPassword, proxyNtlmDomain);
        XML_API.http.setProxy(proxyHost, proxyPort, proxyUsername, proxyPassword, proxyNtlmDomain);
      }

      if (headers === undefined) {
        if (method !== 'GET') {
          IALOG.debug("\t\tAdding default header {0}={1}", 'Content-Type', 'application/json');
          XML_API.http.addHeader('Content-Type', 'application/json');
        }
      } else if (headers != null) {
        for (header in headers) {
          IALOG.debug("\t\tAdding header {0}={1}", header, headers[header]);
          XML_API.http.addHeader(header, headers[header]);
        }
      }

      var resp;
      if (method === 'POST') {
        IALOG.debug("\t\tPOST to: {0} with payload: {1}", urL, jsonStr );
        resp = XML_API.http.post(jsonStr);
      }
      else if (method === 'PUT') {
        IALOG.debug("\t\tPUT to: {0} with payload: {1}", urL, JSON.stringify(jsonStr) );
        resp = XML_API.http.put(jsonStr);
      }
      else if (method === 'GET') {
        IALOG.debug("\t\tGET from: {0}", urL);
        resp = XML_API.http.get();
      }
      else if (method === 'PATCH') {
        IALOG.debug("\t\tPATCH to: {0} with payload: {1}", urL, JSON.stringify(jsonStr) );
        resp = XML_API.http.patch(jsonStr);
      }
      else if (method === 'DELETE') {
        IALOG.debug("\t\tDELETE from: {0}", urL);
        resp = XML_API.http.delete();
      }

      var response = {};
      response.status = resp.getStatusLine().getStatusCode();
      response.body = XML_API.http.getResponseAsString(resp);
      XML_API.http.releaseConnection(resp);
      IALOG.info("\t\tReceived response code: {0} and payload: {1}", response.status, response.body);
      return response;
    }
  }
})();
