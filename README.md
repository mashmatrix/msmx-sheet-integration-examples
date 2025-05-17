# Mashmatrix Sheet Integration Examples

- [README (Japanese)](./README_ja.md)

This project is intended to show the possibilities of [Mashmatrix Sheet](https://www.mashmatrix.com/) using its open APIs.

There are examples that uses following APIs:

- Message Channel API (en | [ja](https://docs.mashmatrix.com/mashmatrix-sheet/v/ja/customization/developing_apps_using_message_channel_api))
- Platform Event API (en | [ja](https://docs.mashmatrix.com/mashmatrix-sheet/v/ja/customization/capturing_user_ops_using_platform_event_api))

## Preparation

- Check out the latest source code of this repository
- Install Salesforce CLI
- Connect to Salesforce DevHub org to create new scratch orgs

## Setup Procedure

1. Create a scratch org to setup integration examples.

```sh
$ sf org create scratch -f config/project-scratch-def.json -a msmx-sheet-integration -c -w 10
```

2. Install Mashmatrix Sheet trial package from command line.

```sh
$ sf package install --package 04tIT0000013THjYAM -o msmx-sheet-integration -w 10
```

3. Install Dynamic Interaction Component Example from command line.

```sh
$ sf package install --package 04tdL0000009JD7QAM -o msmx-sheet-integration -w 10
```

4. Assign required permission sets to the scratch org's default user.

```sh
$ sf org assign permset --name msmxSheet__MashmatrixSheetUser --name msmxSheet__MashmatrixSheetAdministrator -o msmx-sheet-integration
```

5. Deploy this example repository's source code to the scratch org.

```sh
$ sf project deploy start -d force-app/main -o msmx-sheet-integration
```

6. Assign a permission set to access example components.

```sh
$ sf org assign permset --name Mashmatrix_Sheet_Integration_Examples -o msmx-sheet-integration
```

7. Load example data using [SFDX migration automatic](https://github.com/stomita/sfdx-migration-automatic) plugin

```sh
$ sf plugins install sfdx-migration-automatic
$ sf automig load --inputdir data/records -u msmx-sheet-integration
$ sf automig load --inputdir data/books -u msmx-sheet-integration
```

8. Open Mashmatrix Sheet to confirm the loaded books/records are accessible.

```sh
$ sf org open -o msmx-sheet-integration -p /lightning/n/msmxSheet__MashmatrixSheet
```

9. Confim IDs of the books listed in left sidebar (from book setting menu), and memo them with their name.

10. Open "Mashmatrix Sheet Integration Examples" app from app launcher.

11. Focus on "Map Integration" tab, open "Edit Page" from right top menu.

12. Select "Account Search" component, replace "Book ID" value to the memoed book ID of "Account/Contact" book in step 9. So to "Account Map" and "Contact in Selected Account" components.

13. Focus on "Dynamic Interaction" tab, open "Edit Page" from right top menu.

14. Select the first, second "Mashmatrix Sheet" component in left pane, and the third "Mashmatrix Sheet" component in right pane, replace "Book ID" value to the copied book Id of "Dynamic Interaction" book in step 9.

15. Focus on "Filter Control Integration" tab, open "Edit Page" from right top menu.

16. Select "Accommodations Result" component, replace "Book ID" value to the copied book Id of "Accommodation" book in step 9.

17. Focus on "Message Debug" tab, open "Edit Page" from right top menu.

18. Select "Mashmatrix Sheet" component in the left pane, replace "Book ID" value to the copied book Id of "Book for Event/Message Debug"

19. Focus on "Custom Event" tab, open "Edit Page" from right top menu.

20. Select "Mashmatrix Sheet" component in left pane, replace "Book ID" value to the copied book Id of "Custom Event" book in step 9.

## Examples

### Map Integration

<img width="2051" alt="map-integration-screen" src="https://github.com/mashmatrix/msmx-sheet-integration-examples/assets/23387/96a7f1f6-f69c-49f6-b39a-e1cd3e684766">

On "Map Integration" tab, there are two Mashmatrix Sheet components and one custom map component in the page.
The "Account Search" sheet component located in left pane queries account records in the organization, filtering by state or account type.
The map component receives message of `loadComplete` with the searched result, then plots them on the map.
If the user clicks a plotted account entry, it publishes `setParameters` message with its account ID.
The "Contacts in Selected Account" sheet component, located in the right-bottom of the page, is referring the accountId parameter in its filter,
so it will list all contact records belonging to selected account.

### Filter Condition Integration

<img width="2055" alt="filter-control-integration-screen" src="https://github.com/mashmatrix/msmx-sheet-integration-examples/assets/23387/03a43eb9-b823-405f-83ee-5bfccc3077a2">

On "Filter Condition Integration" tab, there are two components in the page.
One is the custom control component, which publishes `setParameters` message according to the control input by the user.
Another is a Mashmatrix Sheet component that lists accomodations data in the org, which references parameter value ｓ in its filters.
By changing the control input in the control component, the sheet component will be automatically refreshed to list the records matching with the inputted conditions.

To reference parameter values in filters, please check the ”[Reference Value](https://docs.mashmatrix.com/mashmatrix-sheet/functions_about_displaying_data/reference_value)" page in user guide.

### Message Debug

<img width="2055" alt="message-debug-screen" src="https://github.com/mashmatrix/msmx-sheet-integration-examples/assets/23387/b06a2dc3-78b7-4026-b590-fa70c93e4e34">

On "Message Debug" tab, it shows one sheet component and two custom components.
The "Debug Messages" component lists all messages published to message channels, and events published to platform events of Mashmatrix Sheet in real time.
The "Publish Messages" component can create raw messages to publish to message channels by specifying message payload in JSON in the textarea.

### Custom Event

<img width="2055" alt="message-debug-screen" src="https://github.com/user-attachments/assets/56c60aa2-8aad-4d31-bb73-a3b99dfc361d">

On the "Custom Event" tab, it shows one sheet component and two custom components.
The "Custom Event on Action Button" component will receive a custom event named "calcSum" after clicking the "Sum" button to perform the sum of the "Price per Day", "Bathrooms" and "Bedrooms" columns of the currently selected records.
The "Custom Event on Action Link" component will receive a custom event named "accommodationDetail" when the "Accommodation Name" is clicked. It will then display the detailed information of the accommodation.

### Dynamic Interaction

<img width="2055" alt="dynamic-interaction-screen" src="https://github.com/user-attachments/assets/3aa8dc84-5f63-413f-8180-8aa070313e92">

On the "Dynamic Interaction" tab, there are three Mashmatrix Sheet components and one custom chart component on the page.

The "Account Chart" component will display the total amount from Opportunities grouped by Account when a record is focused or selected in the first sheet.
When clicking on a bar in the chart, it will publish a dynamic interaction event that includes the properties (accountId, startDate, endDate, year).
The dynamic interaction event will set the `parameters` property of the 2nd sheet to the value `accountId={!Event.accountId}&startDate={!Event.startDate}&endDate={!Event.endDate}`, since the filter is set to the closeDate and accountId columns, the 2nd sheet will refresh according to the selected accountId and startDate, endDate
Similarly, it will set the `parameters` property for the 3rd sheet to the value `year={!Event.year}`, since the filter of the 3rd sheet is set to the year column, the 3rd sheet will be refreshed according to the selected year
