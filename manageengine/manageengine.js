load("integrationservices/manageengine/configuration.js");
load("integrationservices/manageengine/XML_API.js");
load("lib/integrationservices/javascript/event.js");

function apia_event(form) {

  IALOG.info(JSON.stringify(form, null, 2));

  var workorderid = form.properties.workorderid;

  IALOG.info("Work Order ID Received: " + workorderid);

  var me_request_url = ME_SD_BASE_URL + "/" + workorderid;
  var parameters = "OPERATION_NAME=GET_REQUEST&TECHNICIAN_KEY=" + TECHNICIAN_KEY + "&FORMAT=json";

  var servicedesk_header = {
    "Content-Type": "application/x-www-form-urlencoded"
  }

  var request = XMIO.post(parameters, me_request_url, null, null, servicedesk_header);

  var xml = XMUtil.parseXML(request.body);

  var xmatters_header = {
    "Content-Type": "application/xml"
  }

  XML_API.post(xml, WEB_SERVICE_URL, INITIATOR, XMIO.decryptFile(PASSWORD), xmatters_header);

  return;
}
