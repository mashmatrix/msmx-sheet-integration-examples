import { LightningElement, track } from "lwc";
import {
  APPLICATION_SCOPE,
  createMessageContext,
  releaseMessageContext,
  subscribe as subscribeMessageChannel,
  unsubscribe as unsubscribeMessageChannel
} from "lightning/messageService";
import MC_FIRE_CUSTOM_EVENT from "@salesforce/messageChannel/msmxSheet__fireCustomEvent__c";
import MC_SELECT_RECORDS from "@salesforce/messageChannel/msmxSheet__selectRecords__c";
/**
 *
 */
const MESSAGE_CHANNELS = {
  fireCustomEvent: MC_FIRE_CUSTOM_EVENT,
  selectRecords: MC_SELECT_RECORDS
};
/**
 *
 */

export default class CustomEventButton extends LightningElement {
  messageContext;

  subscriptions = [];

  @track totalPrice = 0;

  @track totalBathrooms = 0;

  @track totalBedrooms = 0;

  connectedCallback() {
    this._initMessageChannelSubscriptions();
  }

  disconnectedCallback() {
    for (const subscr of this.subscriptions) {
      subscr.unsubscribe();
    }
    this.subscriptions = [];
    if (this.messageContext) {
      releaseMessageContext(this.messageContext);
      this.messageContext = null;
    }
  }

  _initMessageChannelSubscriptions() {
    this.messageContext = createMessageContext();
    this.subscriptions = [
      ...this.subscriptions,
      ...Object.keys(MESSAGE_CHANNELS).map((channelName) => {
        const subscr = subscribeMessageChannel(
          this.messageContext,
          MESSAGE_CHANNELS[channelName],
          (message) => {
            this.handleIncomingMessage("message-channel", channelName, message);
          },
          { scope: APPLICATION_SCOPE }
        );
        return {
          unsubscribe: () => unsubscribeMessageChannel(subscr)
        };
      })
    ];
  }

  handleIncomingMessage(messageType, channelName, message) {
    this.eventName = message.eventName;
    if (this.eventName === "calcSum") {
      this.calculateSum(message);
    }
    if (channelName === "selectRecords" && message.records.length === 0) {
      this.totalPrice = 0;
      this.totalBathrooms = 0;
      this.totalBedrooms = 0;
    }
  }

  calculateSum(message) {
    const { records } = message;

    this.totalPrice = records.reduce(
      (sum, record) => sum + (parseFloat(record.PricePerDay__c) || 0),
      0
    );
    this.totalBathrooms = records.reduce(
      (sum, record) => sum + (parseFloat(record.Bathrooms__c) || 0),
      0
    );
    this.totalBedrooms = records.reduce(
      (sum, record) => sum + (parseFloat(record.Bedrooms__c) || 0),
      0
    );
  }
}