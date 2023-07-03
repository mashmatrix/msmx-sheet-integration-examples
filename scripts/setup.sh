#!/bin/sh

sfdx force:package:install --package 04t0K000001E4iS
sfdx force:user:permset:assing --permsetname msmxSheet__MashmatrixSheetUser
sfdx force:user:permset:assign --permsetname msmxSheet__MashmatrixSheetAdministrator

sfdx force:source:push
sfdx force:user:permset:assign --permsetname Mashmatrix_Sheet_Integration_Examples

sfdx force:org:open