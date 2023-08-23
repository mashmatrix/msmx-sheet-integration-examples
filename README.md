# Mashmatrix Sheet Integration Examples

This project is intended to show the possibilities of [Mashmatrix Sheet](https://www.mashmatrix.com/) using its open APIs.

There are examples that uses following APIs:

- Message Channel API (en | [ja](https://docs.mashmatrix.com/mashmatrix-sheet/v/ja/customization/developing_apps_using_message_channel_api))
- Platform Event API (en | [ja](https://docs.mashmatrix.com/mashmatrix-sheet/v/ja/customization/capturing_user_ops_using_platform_event_api))

## Preparation

- Check out the latest source code of this repository
- Connect to Salesforce DevHub org to create new scratch orgs.

## Setup Procedure

1. Create a scratch org to setup integration examples.

```sh
$ sfdx force:org:create -f config/project-scratch-def.json -a msmx-sheet-integration -w 10
```

2. Install Mashmatrix Sheet trial package from command line.

```sh
$ sfdx force:package:install --package 04t0K000001E4ll -u msmx-sheet-integration -w 10
```

3. Assign required permission sets to the scratch org's default user.

```sh
$ sfdx force:user:permset:assign --permsetname msmxSheet__MashmatrixSheetUser -u msmx-sheet-integration
$ sfdx force:user:permset:assign --permsetname msmxSheet__MashmatrixSheetAdministrator -u msmx-sheet-integration
```

4. Push this example repository's source code to the scratch org.

```sh
$ sfdx force:source:push -u msmx-sheet-integration
```

5. Assign a permission set to access example components.

```sh
$ sfdx force:user:permset:assign --permsetname Mashmatrix_Sheet_Integration_Examples -u msmx-sheet-integration
```

6. Load example data using [SFDX migration automatic](https://github.com/stomita/sfdx-migration-automatic) plugin

```sh
$ sfdx plugins:install sfdx-migration-automatic
$ sfdx automig:load --inputdir data/records -u msmx-sheet-integration
$ sfdx automig:load --inputdir data/books -u msmx-sheet-integration
```

7. Open Mashmatrix Sheet to confirm the loaded books/records are accessible.

```sh
$ sfdx force:org:open -u msmx-sheet-integration -p /lightning/n/msmxSheet__MashmatrixSheet
```

8. Confim IDs of the books listed in left sidebar (from book setting menu), and memo them with their name.

9. Open "Mashmatrix Sheet Integration Examples" app from app launcher.

10. Focus on "Map Integration" tab, open "Edit Page" from right top menu.

11. Select "Account Search" component, replace "Book ID" value to the memoed book ID of "Account/Contact" book in step 8. So to "Account Map" and "Contact in Selected Account" components.

12. Focus on "Filter Control Integration" tab, open "Edit Page" from right top menu.

13. Select "Accommodations Result" component, replace "Book ID" value to the copied book Id of "Accomodation" book in step 8.

14. Focus on "Message Debug" tab, open "Edit Page" from right top menu.

15. Select "Mashmatrix Sheet" component in the left pane, replace "Book ID" value to the copied book Id of "Book for Event/Message Debug"

## Examples

### Map Integration

<img width="2051" alt="map-integration-screen" src="https://github.com/mashmatrix/msmx-sheet-integration-examples/assets/23387/96a7f1f6-f69c-49f6-b39a-e1cd3e684766">

### Filter Condition Integration

<img width="2055" alt="filter-control-integration-screen" src="https://github.com/mashmatrix/msmx-sheet-integration-examples/assets/23387/03a43eb9-b823-405f-83ee-5bfccc3077a2">

### Message Debug

<img width="2055" alt="message-debug-screen" src="https://github.com/mashmatrix/msmx-sheet-integration-examples/assets/23387/b06a2dc3-78b7-4026-b590-fa70c93e4e34">

