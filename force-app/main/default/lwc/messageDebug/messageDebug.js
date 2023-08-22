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
import MC_EXECUTE_COMMAND from "@salesforce/messageChannel/msmxSheet__executeCommand__c";

/**
 *
 */
const MESSAGE_CHANNELS = {
  selectRecords: MC_SELECT_RECORDS,
  focusCell: MC_FOCUS_CELL,
  loadComplete: MC_LOAD_COMPLETE,
  setParameters: MC_SET_PARAMETERS,
  executeCommand: MC_EXECUTE_COMMAND
};

/**
 *
 */
export default class MessageDebug extends LightningElement {
  messageContext;

  messagePanelOpened = false;

  messages = [];

  subscriptions = null;

  get messageLogsEmpty() {
    return this.messages.length === 0;
  }

  connectedCallback() {
    this.messageContext = createMessageContext();
    this.subscriptions = Object.keys(MESSAGE_CHANNELS).map((channelName) => {
      const subscr = subscribe(
        this.messageContext,
        MESSAGE_CHANNELS[channelName],
        (message) => {
          this.handleIncomingMessage("message-channel", channelName, message);
        },
        { scope: APPLICATION_SCOPE }
      );
      return {
        unsubscribe: () => unsubscribe(subscr)
      };
    });
  }

  disconnectedCallback() {
    if (this.subscriptions) {
      for (const subscr of this.subscriptions) {
        subscr.unsubscribe();
      }
    }
    if (this.messageContext) {
      releaseMessageContext(this.messageContext);
      this.messageContext = null;
    }
  }

  handleIncomingMessage(messageType, channelName, message) {
    const messageId =
      String(Date.now()) + "_" + Math.random().toString(36).substring(2);
    this.messages = [
      {
        id: messageId,
        messageClass: `message ${messageType}`,
        channelName: channelName,
        raw: message,
        text: JSON.stringify(message, null, 2),
        componentId: message.componentId,
        bookId: message.bookId,
        sheetId: message.sheetId,
        timestamp: new Date().toLocaleTimeString(),
        opened: false
      },
      ...this.messages
    ];
  }

  handleMessageToggle(event) {
    const messageId = event.currentTarget.dataset.messageId;
    console.log(event.currentTarget.dataset, event.detail);
    const message = this.messages.find((m) => m.id === messageId);
    if (message) {
      message.opened = !message.opened;
      this.messages = [...this.messages];
    }
  }

  handleClearMessageLogs() {
    this.messages = [];
  }

  toggleOpenMessagePanel() {
    this.messagePanelOpened = !this.messagePanelOpened;
  }
}
