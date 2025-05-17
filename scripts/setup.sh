#!/bin/sh

sf org create scratch -f config/project-scratch-def.json -a msmx-sheet-integration -c -w 10

sf package install --package 04tIT0000013THjYAM -o msmx-sheet-integration -w 10
sf package install --package 04tdL0000009JD7QAM -o msmx-sheet-integration -w 10

sf org assign permset --name msmxSheet__MashmatrixSheetUser --name msmxSheet__MashmatrixSheetAdministrator -o msmx-sheet-integration

sf project deploy start -d force-app/main -o msmx-sheet-integration
sf org assign permset --name Mashmatrix_Sheet_Integration_Examples -o msmx-sheet-integration

sf plugins install sfdx-migration-automatic
sf automig load --inputdir data/records -u msmx-sheet-integration
sf automig load --inputdir data/books -u msmx-sheet-integration

sf org open -o msmx-sheet-integration -p /lightning/n/msmxSheet__MashmatrixSheet