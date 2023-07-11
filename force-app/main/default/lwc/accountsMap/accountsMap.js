import { LightningElement, api } from "lwc";
import {
  subscribe,
  unsubscribe,
  publish,
  createMessageContext,
  releaseMessageContext,
  APPLICATION_SCOPE
} from "lightning/messageService";
import MC_LOAD_COMPLETE from "@salesforce/messageChannel/msmxSheet__loadComplete__c";
import MC_SELECT_RECORDS from "@salesforce/messageChannel/msmxSheet__selectRecords__c";
import MC_FOCUS_CELL from "@salesforce/messageChannel/msmxSheet__focusCell__c";
import MC_SET_PARAMETERS from "@salesforce/messageChannel/msmxSheet__setParameters__c";

export default class AccountsMap extends LightningElement {
  @api
  bookId;

  @api
  sheetId;

  messageContext;

  allAccounts = [];

  selectedAccounts = [];

  selectedMarkerValue = "";

  subscriptions = null;

  mapMarkers = undefined;

  connectedCallback() {
    this.messageContext = createMessageContext();
    this.subscriptions = {};
    this.subscriptions.loadComplete = subscribe(
      this.messageContext,
      MC_LOAD_COMPLETE,
      (message) => {
        this.handleSheetLoadComplete(message);
      },
      { scope: APPLICATION_SCOPE }
    );
    this.subscriptions.selectRecords = subscribe(
      this.messageContext,
      MC_SELECT_RECORDS,
      (message) => {
        this.handleSheetSelectRecords(message);
      },
      { scope: APPLICATION_SCOPE }
    );
    this.subscriptions.focusCell = subscribe(
      this.messageContext,
      MC_FOCUS_CELL,
      (message) => {
        this.handleSheetFocusCell(message);
      },
      { scope: APPLICATION_SCOPE }
    );
  }

  disconnectedCallback() {
    if (this.subscriptions) {
      unsubscribe(this.subscriptions.loadComplete);
      unsubscribe(this.subscriptions.selectRecords);
      unsubscribe(this.subscriptions.focusCell);
      this.subscriptions = null;
    }
    if (this.messageContext) {
      releaseMessageContext(this.messageContext);
      this.messageContext = null;
    }
  }

  handleSheetLoadComplete(message) {
    if (this.bookId !== message.bookId || this.sheetId !== message.sheetId) {
      return;
    }
    this.allAccounts = message.records;
    this._assignToMapMarkers();
  }

  handleSheetSelectRecords(message) {
    if (this.bookId !== message.bookId || this.sheetId !== message.sheetId) {
      return;
    }
    this.selectedAccounts = message.records;
    this._assignToMapMarkers();
  }

  _assignToMapMarkers() {
    this.mapMarkers = (
      this.selectedAccounts.length > 0
        ? this.selectedAccounts
        : this.allAccounts
    ).map((acc) => ({
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
    publish(this.messageContext, MC_SET_PARAMETERS, {
      parameters: { accountId: this.selectedMarkerValue }
    });
  }

  handleMarkerSelect(e) {
    this.selectedMarkerValue = e.detail.selectedMarkerValue;
    publish(this.messageContext, MC_SET_PARAMETERS, {
      parameters: { accountId: this.selectedMarkerValue }
    });
  }
}
