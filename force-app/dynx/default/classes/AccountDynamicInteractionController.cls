public with sharing class AccountDynamicInteractionController {
  @AuraEnabled
  public static List<Account> getAccounts(List<String> recordIds) {
    if (recordIds != null && !recordIds.isEmpty()) {
      return [
        SELECT
          Id,
          Name,
          Description,
          BillingStreet,
          BillingCity,
          BillingState,
          BillingCountry
        FROM Account
        WHERE Id IN :recordIds
      ];
    }
    return [
      SELECT
        Id,
        Name,
        Description,
        BillingStreet,
        BillingCity,
        BillingState,
        BillingCountry
      FROM Account
      WHERE
        BillingCity != NULL
        OR BillingState != NULL
        OR BillingCountry != NULL
      LIMIT 200
    ];
  }

  @AuraEnabled
  public static Decimal getAnnualRevenue(String recordId) {
    List<Account> accounts = [
      SELECT Id, AnnualRevenue
      FROM Account
      WHERE Id = :recordId
    ];
    return accounts.isEmpty() ? 0 : accounts[0].AnnualRevenue;
  }
}