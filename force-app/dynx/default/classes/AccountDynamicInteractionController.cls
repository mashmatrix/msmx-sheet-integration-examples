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
  public static List<AnnualRevenueDTO> getAnnualRevenue(String recordId) {
      List<AggregateResult> results = [
          SELECT 
              CALENDAR_YEAR(CloseDate) year, 
              SUM(Amount) total,
              MIN(CloseDate) minDate,
              MAX(CloseDate) maxDate
          FROM Opportunity
          WHERE AccountId = :recordId
          GROUP BY CALENDAR_YEAR(CloseDate)
          ORDER BY CALENDAR_YEAR(CloseDate)
      ];

      List<AnnualRevenueDTO> data = new List<AnnualRevenueDTO>();
      for (AggregateResult agg : results) {
        data.add(new AnnualRevenueDTO(agg));
      }

      return data;
  }
  public class AnnualRevenueDTO {
    @AuraEnabled public Integer year;
    @AuraEnabled public Decimal amount;
    @AuraEnabled public Date startDate;
    @AuraEnabled public Date endDate;

    public AnnualRevenueDTO(AggregateResult agg) {
      this.year = (Integer)agg.get('year');
      this.amount = (Decimal)agg.get('total');
      this.startDate = (Date)agg.get('minDate');
      this.endDate = (Date)agg.get('maxDate');
    }
  }
}