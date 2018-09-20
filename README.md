# ManageEngine
This is a one-way xMatters integration with ManageEngine.

# Pre-Requisites
* This integration was designed with ManageEngine ServiceDesk Plus version 9.4
* A server to configure the Integration Agent

# Files
* [ManageEngineCommPlan.zip](ManageEngineCommPlan.zip)
* [manageengine.zip](manageengine.zip)
* [xMattersEvent.bat](xMattersEvent.bat)
* [xMatters Integration Agent](https://support.xmatters.com/hc/en-us/articles/201463419-Integration-Agent-for-xMatters-On-Demand)

# How it works
From within ManageEngine a Custom Trigger will invoke a batch file and pass a Work Order ID. Once this batch file is invoked, the Work Order ID is passed to the Integration Agent via the APClient.bin command execution. From within the Integration Agent the integration is designed to retrieve the ManageEngine request details through a web service call using the Work Order ID received. Once the full request details are retrieved from ManageEngine, the XML detail returned is submitted to the xMatters Integration Builder. From within the xMatters Integration Builder the XML request is converted to JSON, any existing xMatters events matching the Work Order ID are terminated, a recipient is assigned to the event using the ManageEngine Technician Login Name, and then an xMatters event is created to notify the recipient.

# Installation
The installation requires Administrative access into ManageEngine to configure the Custom Trigger.

## ManageEngine set up
1. Steps to create a new Shared Library or (in|out)bound integration or point them to the xMatters online help to cover specific steps; i.e., import a communication plan (link: http://help.xmatters.com/OnDemand/xmodwelcome/communicationplanbuilder/exportcommplan.htm)
2. Add this code to some place on what page:
   ```
   var items = [];
   items.push( { "stuff": "value"} );
   console.log( 'Do stuff' );
   ```


## Application ABC set up
Any specific steps for setting up the target application? The more precise you can be, the better!

Images are encouraged. Adding them is as easy as:
```
<kbd>
  <img src="media/cat-tax.png" width="200" height="400">
</kbd>
```

<kbd>
  <img src="media/cat-tax.png" width="200" height="400">
</kbd>


# Testing
Be specific. What should happen to make sure this code works? What would a user expect to see?

# Troubleshooting
Optional section for how to troubleshoot. Especially anything in the source application that an xMatters developer might not know about, or specific areas in xMatters to look for details - like the Activity Stream?
