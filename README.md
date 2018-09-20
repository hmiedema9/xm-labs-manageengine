# ManageEngine
This is a one-way xMatters integration with ManageEngine.

# Pre-Requisites
* This integration was designed with ManageEngine ServiceDesk Plus version 9.4
* A server to configure the xMatters Integration Agent

# Files
* [ManageEngineCommPlan.zip](ManageEngineCommPlan.zip)
* [manageengine.zip](manageengine.zip)
* [xMattersEvent.bat](xMattersEvent.bat)
* [xMatters Integration Agent](https://support.xmatters.com/hc/en-us/articles/201463419-Integration-Agent-for-xMatters-On-Demand)

# How it works
From within ManageEngine a Custom Trigger will invoke a batch file and pass a Work Order ID. Once this batch file is invoked, the Work Order ID is passed to the Integration Agent via the APClient.bin command execution. From within the Integration Agent the integration service is designed to retrieve the ManageEngine request details through a web service call using the Work Order ID received. The full request details are retrieved from ManageEngine in XML format. The XML is then submitted to the xMatters Integration Builder via a POST web service call. From within the xMatters Integration Builder the XML request is converted to JSON, any existing xMatters events matching the Work Order ID are terminated, a recipient is assigned to the event using the ManageEngine Technician Login Name, and then an xMatters event is created to notify the recipient.

# Installation
The installation requires Administrative access into ManageEngine to configure the Custom Trigger.

## xMatters Configuration
1. Create a REST Web Service User in xMatters
2. Navigate to the Developer tab and import the [ManageEngineCommPlan.zip](ManageEngineCommPlan.zip)
3. Configure the Form for Web Services and add the REST Web Services role for Sender Permissions
4. Navigate to the Integration Builder tab and update the xMatters Endpoint to include the new REST Web Service user
5. Select the Inbound Integration link to update the Inbound Integration for Basic Authentication

## Integration Agent Configuration
1. Navigate to the ManageEngine Server
2. From within the ManageEngine server configure [xMatters Integration Agent](https://support.xmatters.com/hc/en-us/articles/201463419-Integration-Agent-for-xMatters-On-Demand)
3. Once configured extract the [manageengine.zip](manageengine.zip) to the IAHOME/integrationservices folder
4. Open the `IAHOME/integrationservices/configuration.js` in a text editor and insert the needed values
5. Update the IAConfig.xml to reflect this new integration service

## ManageEngine Administration
1. Navigate to Admin > Custom Triggers
2. From within Custom Triggers configure a new Trigger with the following:
* Action Name: xMattersEvent
* Criteria: Per the requirement
* Perform Action:
  * Action Type: Execute Script
  * Script file to run: `cmd /c xMattersEvent.bat "$WORKORDERID"`

![Custom Trigger](media/me_custom_trigger.png?raw=true)

## ManageEngine Server Configuration
1. Navigate to `[SDP_HOME]/integration/custom_scripts/` directory and add the [xMattersEvent.bat](xMattersEvent.bat)
2. Open the xMattersEvent.bat and update the file paths and versioning to reflect the location of the Integration Agent.

# Testing
Create a ManageEngine request matching the criteria of the Custom Trigger condition. If a condition is matched, the action will invoke the process and an event will create in xMatters.

# Troubleshooting
There are four potential points of failure:
1. Custom Trigger executing the xMattersEvent.bat.
    * If the xMattersEvent.bat is successfully executed, the batch file will create a xMattersLog.txt in the `[SDP_HOME]/integration/custom_scripts/` directory.

2. xMattersEvent.bat executing the Integration Agent.
    * If the xMattersEvent.bat is successfully being invoked, the xMattersLog.txt will display the submission to the Integration Agent. The command to be executed will be echoed to the xMattersLog.txt. The command from the xMattersLog.txt can be pasted into the CMD or executed by right-clicking the batch file. This will require updating the batch file to contain a miscellaneous work order id.

3. Integration Agent communicating with ManageEngine to retrieve the full request details
    * This can be observed and resolved be reviewing the Integration Agent logging

4. Integration Agent communicating with the xMatters
    * Ensure that the xMatters REST Web Service user has access to the xMatters Endpoint
