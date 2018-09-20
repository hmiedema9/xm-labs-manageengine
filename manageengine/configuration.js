// ----------------------------------------------------------------------------------------------------
// Configuration settings for an xMatters Communication Plan Integration
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
// The Inbound Integration Builder URL that will be used to inject events into xMatters.
// ----------------------------------------------------------------------------------------------------
WEB_SERVICE_URL = "";

//----------------------------------------------------------------------------------------------------
// The username and password used to authenticate the request to xMatters.
// The PASSWORD value is a path to a file where the
// user's password should be encrypted using the iapassword.sh utility.
// Please see the integration agent documentation for instructions.
//----------------------------------------------------------------------------------------------------
INITIATOR = "manageengine";
PASSWORD = "integrationservices/manageengine/.initiatorpasswd";

// ----------------------------------------------------------------------------------------------------
// ManageEngine ServiceDesk Technician Key
// ----------------------------------------------------------------------------------------------------
ME_SD_BASE_URL = "https://<ManageEngine ServiceDesk URL>.com/sdpapi/request";

//Example Technician Key: 334D54RT-89FG-8899-8B28-CA295BD4FCCA
TECHNICIAN_KEY = "";
