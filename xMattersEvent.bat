@echo off

SET ia_drive=E:

SET ia_path=%ia_drive%\xMatters\integrationagent-5.2.1\bin

SET event_submission=APClient.bin.exe --map-data "applications^|manageengine" %1%

@echo Event Submission: %event_submission%> xMattersEventLog.txt

cmd /c "%ia_drive% & cd %ia_path% & %event_submission%

REM Example Command Submission: cmd /c "E: & cd E:\xMatters\integrationagent-5.2.1\bin & APClient.bin.exe --map-data applications^|ping-plan test"
