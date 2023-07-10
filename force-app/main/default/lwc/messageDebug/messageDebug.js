import { LightningElement } from "lwc";
import {
  APPLICATION_SCOPE,
  createMessageContext,
  releaseMessageContext,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import MC_SELECT_RECORDS from "@salesforce/messageChannel/msmxSheet__selectRecords__c";
import MC_FOCUS_CELL from "@salesforce/messageChannel/msmxSheet__focusCell__c";
import MC_LOAD_COMPLETE from "@salesforce/messageChannel/msmxSheet__loadComplete__c";
import MC_SET_PARAMETERS from "@salesforce/messageChannel/msmxSheet__setParameters__c";

/**
 *
 */
const msgChannels = {
  selectRecords: MC_SELECT_RECORDS,
  focusCell: MC_FOCUS_CELL,
  loadComplete: MC_LOAD_COMPLETE,
  setParameters: MC_SET_PARAMETERS
};

/**
 *
 */
export default class MessageDebug extends LightningElement {
  messageContext;

  opened = false;

  logText = "";

  subscriptions = null;

  connectedCallback() {
    this.messageContext = createMessageContext();
    this.subscriptions = Object.keys(msgChannels).map((channelName) =>
      subscribe(
        this.messageContext,
        msgChannels[channelName],
        (message) => {
          this.handleMessage(channelName, message);
        },
        { scope: APPLICATION_SCOPE }
      )
    );
  }

  disconnectedCallback() {
    if (this.subscriptions) {
      for (const subscription of this.subscriptions) {
        unsubscribe(subscription);
      }
    }
    if (this.messageContext) {
      releaseMessageContext(this.messageContext);
      this.messageContext = null;
    }
  }

  handleMessage(channelName, message) {
    this.logText =
      channelName +
      " => " +
      JSON.stringify(message, null, 2) +
      "\n" +
      this.logText;
  }

  toggleOpen() {
    this.opened = !this.opened;
  }
}
