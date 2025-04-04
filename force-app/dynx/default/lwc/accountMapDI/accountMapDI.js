import { LightningElement, api } from 'lwc';
import getAccounts from '@salesforce/apex/AccountDynamicInteractionController.getAccounts';

export default class AccountMapDI extends LightningElement {
  allAccounts = [];

  selectedAccounts = [];

  selectedMarkerValue = '';

  mapMarkers = undefined;

  _recordId;

  _recordIds;

  @api
  get recordId() {
    return this._recordId;
  }

  set recordId(value) {
    if (value) {
      this._recordId = value;
      const recordIds = [this._recordId];
      this.handleSheetSelectRecords(recordIds);
    }
  }

  @api
  get recordIds() {
    return this._recordIds;
  }

  set recordIds(value) {
    if (value) {
      this._recordIds = value.split(',');
      this.handleSheetSelectRecords(this._recordIds);
    }
  }

  connectedCallback() {
    this.initAccountsMap();
  }

  async initAccountsMap() {
    this.allAccounts = await getAccounts({ recordIds: null });
    this._assignToMapMarkers();
  }

  async handleSheetSelectRecords(recordIds) {
    this.selectedAccounts = await getAccounts({ recordIds: recordIds });
    this._assignToMapMarkers();
  }

  _assignToMapMarkers() {
    this.mapMarkers = (
      this.selectedAccounts.length > 0
        ? this.selectedAccounts
        : this.allAccounts
    ).map(acc => ({
      icon: 'standard:account',
      title: acc.Name,
      description: acc.Description,
      value: acc.Id,
      location: {
        Street: acc.BillingStreet,
        City: acc.BillingCity,
        State: acc.BillingState,
        Country: acc.BillingCountry,
      },
    }));
  }

  handleMarkerSelect(e) {
    this.selectedMarkerValue = e.detail.selectedMarkerValue;

    this.dispatchEvent(
      new CustomEvent('selectmarker', {
        detail: { accountId: this.selectedMarkerValue },
      }),
    );
  }
}