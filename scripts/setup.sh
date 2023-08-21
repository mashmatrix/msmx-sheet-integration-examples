#!/bin/sh

sfdx force:org:create -f config/project-scratch-def.json -a msmx-sheet-integration -w 10

sfdx force:package:install --package 04t0K000001E4ll -u msmx-sheet-integration -w 10
sfdx force:user:permset:assign --permsetname msmxSheet__MashmatrixSheetUser -u msmx-sheet-integration
sfdx force:user:permset:assign --permsetname msmxSheet__MashmatrixSheetAdministrator -u msmx-sheet-integration

sfdx force:source:push -u msmx-sheet-integration
sfdx force:user:permset:assign --permsetname Mashmatrix_Sheet_Integration_Examples -u msmx-sheet-integration

sfdx plugins:install sfdx-migration-automatic

sfdx automig:load --inputdir data/records -u msmx-sheet-integration
sfdx automig:load --inputdir data/books -u msmx-sheet-integration

sfdx force:org:open -u msmx-sheet-integration -p /lightning/n/msmxSheet__MashmatrixSheet