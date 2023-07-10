# Mashmatrix Sheet Integration Examples

This project is intended to show the possibilities of [Mashmatrix Sheet](https://www.mashmatrix.com/) using its open APIs.

There are examples that uses following APIs:

- [Message Channel API](https://docs.mashmatrix.com/)
- [Platform Event API](https://docs.mashmatrix.com/)

## Setup

1. Create a scratch org to setup integration examples.

```sh
$ sfdx force:org:create -f config/project-scratch-def.json -a msmx-sheet-integration -w 10
```

2. Install Mashmatrix Sheet trial package from command line.

```sh
$ sfdx force:package:install --package 04t0K000001E4iS -u msmx-sheet-integration
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

7. Open Mashmatris Sheet to confirm the loaded books/records are accessible.

```sh
$ sfdx force:org:open -u msmx-sheet-integration -p /lightning/n/msmxSheet__MashmatrixSheet
```

8. Confim bookIDs of the books listed, and copy with its book name.

9. Open "Mashmatrix Sheet Integration Examples" App from app launcher.

10. On "Map Integration" tab, open "Edit Page" from right menu.

11. Select "Account Search" component, replace "Book ID" value to the copied book Id in step 8. Also replace the book ID for the "Contact in Selected Account" component.

12.
