import { LightningElement, wire } from "lwc";
import {
  MessageContext,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import MC_SELECT_RECORDS from "@salesforce/messageChannel/msmxSheet__selectRecords__c";
import MC_FOCUS_CELL from "@salesforce/messageChannel/msmxSheet__focusCell__c";
import MC_LOAD_COMPLETE from "@salesforce/messageChannel/msmxSheet__loadComplete__c";

/**
 *
 */
const msgChannels = {
  selectRecords: MC_SELECT_RECORDS,
  focusCell: MC_FOCUS_CELL,
  loadComplete: MC_LOAD_COMPLETE
};

/**
 *
 */
export default class MessageDebug extends LightningElement {
  @wire(MessageContext)
  messageContext;

  logText = "";

  connectedCallback() {
    this.subscriptions = Object.keys(msgChannels).map((channelName) =>
      subscribe(this.messageContext, msgChannels[channelName], (message) => {
        this.handleMessage(channelName, message);
      })
    );
  }

  disconnectedCallback() {
    if (this.subscriptions) {
      for (const subscription of this.subscriptions) {
        unsubscribe(subscription);
      }
    }
  }

  handleMessage(channelName, message) {
    this.logText =
      channelName + " => " + JSON.stringify(message, null, 2) + "\n" + this.logText;
  }
}
