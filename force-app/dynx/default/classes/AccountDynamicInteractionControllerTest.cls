@IsTest
public with sharing class AccountDynamicInteractionControllerTest {
    @testSetup
    public static void createData() {
        List<Account> accounts = new List<Account>();
        
        accounts.addAll(new List<Account>{
            new Account(
                Name = 'Test Account1',
                AccountNumber = 'ABC123',
                AnnualRevenue = 120000,
                BillingStreet = 'Street1',
                BillingCity = 'City1',
                BillingState = 'State1',
                BillingCountry = 'Country1'
            ),
            new Account(
                Name = 'Test Account2',
                AccountNumber = 'ABC 123',
                AnnualRevenue = 240000,
                BillingStreet = 'Street2',
                BillingCity = 'City2',
                BillingState = 'State2',
                BillingCountry = 'Country2'
            )
        });
        insert accounts;
    }
    @IsTest
    static void testGetAccounts() {
        List<Account> allAccounts = AccountDynamicInteractionController.getAccounts(new List<String>());
        System.assertEquals(2, allAccounts.size());

        List<Account> selectedAccounts = AccountDynamicInteractionController.getAccounts(new List<String>{allAccounts[0].Id});
        System.AssertEquals(1, selectedAccounts.size());
    }

    @IsTest 
    static void testGetAnnualRevenue() {
        Account account = [SELECT Id FROM Account WHERE Name = 'Test Account1'];
        Decimal revenue = AccountDynamicInteractionController.getAnnualRevenue(account.Id);
        System.AssertEquals(120000, revenue);
    }

}