import { LightningElement, wire } from "lwc";
import {
  subscribe,
  unsubscribe,
  MessageContext
} from "lightning/messageService";
import MC_LOAD_COMPLETE from "@salesforce/messageChannel/msmxSheet__loadComplete__c";
import MC_SELECT_RECORDS from "@salesforce/messageChannel/msmxSheet__selectRecords__c";
import MC_FOCUS_CELL from "@salesforce/messageChannel/msmxSheet__focusCell__c";

export default class AccountsMap extends LightningElement {
  @wire(MessageContext)
  messageContext;

  allAccounts = [];

  selectedAccounts = [];

  selectedMarkerValue = "";

  subscriptions = null;

  mapMarkers = undefined;

  connectedCallback() {
    this.subscriptions = {};
    this.subscriptions.loadComplete = subscribe(
      this.messageContext,
      MC_LOAD_COMPLETE,
      (message) => {
        this.handleSheetLoadComplete(message);
      }
    );
    this.subscriptions.selectRecords = subscribe(
      this.messageContext,
      MC_SELECT_RECORDS,
      (message) => {
        this.handleSheetSelectRecords(message);
      }
    );
    this.subscriptions.focusCell = subscribe(
      this.messageContext,
      MC_FOCUS_CELL,
      (message) => {
        this.handleSheetFocusCell(message);
      }
    );
  }

  disconnectedCallback() {
    if (this.subscriptions) {
      unsubscribe(this.subscriptions.loadComplete);
      unsubscribe(this.subscriptions.selectRecords);
      unsubscribe(this.subscriptions.focusCell);
      this.subscriptions = null;
    }
  }

  handleSheetLoadComplete(message) {
    this.allAccounts = message.records;
    this._assignToMapMarkers();
  }

  handleSheetSelectRecords(message) {
    this.selectedAccounts = message.records;
    this._assignToMapMarkers();
  }

  _assignToMapMarkers() {
    this.mapMarkers = (this.selectedAccounts.length > 0 ? this.selectedAccounts : this.allAccounts).map((acc) => ({
      icon: "standard:account",
      title: acc.Name,
      description: acc.Description,
      value: acc.Id,
      location: {
        Street: acc.BillingStreet,
        City: acc.BillingCity,
        State: acc.BillingState,
        Country: acc.BillingCountry
      }
    }));
  }

  handleSheetFocusCell(message) {
    const recordId = message.record.Id;
    this.selectedMarkerValue = recordId;
  }

  handleMarkerSelect(e) {
    this.selectedMarkerValue = e.detail.selectedMarkerValue;
  }
}
