import { LightningElement } from "lwc";
import {
  APPLICATION_SCOPE,
  createMessageContext,
  releaseMessageContext,
  subscribe as subscribeMessageChannel,
  unsubscribe as unsubscribeMessageChannel
} from "lightning/messageService";
import {
  subscribe as subscribePlatformEvent,
  unsubscribe as unsubscribePlatformEvent,
  onError as onPlatformEventError,
  isEmpEnabled,
} from "lightning/empApi";
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

const PLATFORM_EVENTS = {
  ExecuteQuery__e: "/event/msmxSheet__ExecuteQuery__e",
  SaveRecords__e: "/event/msmxSheet__SaveRecords__e",
  Download__e: "/event/msmxSheet__Download__e"
};

/**
 *
 */
export default class MessageDebug extends LightningElement {
  messageContext;

  messagePanelOpened = false;

  showMessageChannel = true;

  showPlatformEvent = true;

  messages_ = [];

  subscriptions = [];

  get messages() {
    return this.messages_.filter((m) => (m.messageType === "message-channel" ? this.showMessageChannel : this.showPlatformEvent));
  }

  get messageLogsEmpty() {
    return this.messages_.length === 0;
  }

  connectedCallback() {
    this._initMessageChannelSubscriptions();
    this._initPlatformEventSubscriptions();
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

  async _initPlatformEventSubscriptions() {
    const enabled = await isEmpEnabled();
    if (!enabled) {
      console.log('platform event listening is not enabled');
      return;
    }
    this.subscriptions = [
      ...this.subscriptions,
      ...(await Promise.all(
        Object.entries(PLATFORM_EVENTS).map(async ([channelName, channelPath]) => {
          const subscr = await subscribePlatformEvent(
            channelPath,
            -1,
            (message) => {
              this.handleIncomingMessage(
                "platform-event",
                channelName,
                message.data.payload
              );
            }
          );
          return {
            unsubscribe: () => subscr && unsubscribePlatformEvent(subscr)
          };
        })
      ))
    ];
    onPlatformEventError((error) => {
      console.error('Received error from server: ', JSON.stringify(error));
    });
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

  handleIncomingMessage(messageType, channelName, message) {
    const messageId =
      String(Date.now()) + "_" + Math.random().toString(36).substring(2);
    this.messages_ = [
      {
        id: messageId,
        messageType,
        messageClass: `message ${messageType}`,
        channelName,
        raw: message,
        text: JSON.stringify(message, null, 2),
        componentId: message.componentId ?? message.msmxSheet__ComponentId__c,
        bookId: message.bookId ?? message.msmxSheet__BookId__c,
        sheetId: message.sheetId ?? message.msmxSheet__SheetId__c,
        timestamp: new Date().toLocaleTimeString(),
        opened: false
      },
      ...this.messages_
    ];
  }

  handleMessageToggle(event) {
    const messageId = event.currentTarget.dataset.messageId;
    const message = this.messages_.find((m) => m.id === messageId);
    if (message) {
      message.opened = !message.opened;
      this.messages_ = [...this.messages_];
    }
  }

  handleShowMessageChanelToggle() {
    this.showMessageChannel = !this.showMessageChannel;
  }

  handleShowPlatformEventToggle() {
    this.showPlatformEvent = !this.showPlatformEvent;
  }

  handleClearMessageLogs() {
    this.messages_ = [];
  }

  toggleOpenMessagePanel() {
    this.messagePanelOpened = !this.messagePanelOpened;
  }
}
