public with sharing class SheetPlaygroundController {
    @AuraEnabled(cacheable=true)
    public static List<msmxSheet__msmxBook__c> getBooks() {
        return [SELECT Id, Name FROM msmxSheet__msmxBook__c ORDER BY Name];
    }

    @AuraEnabled(cacheable=true)
    public static List<msmxSheet__msmxSheet__c> getSheets(Id bookId) {
        if (bookId == null) {
            return new List<msmxSheet__msmxSheet__c>();
        }
        return [
            SELECT Id, Name, msmxSheet__SheetId__c
            FROM msmxSheet__msmxSheet__c
            WHERE msmxSheet__Book__c = :bookId
            ORDER BY Name
        ];
    }
}