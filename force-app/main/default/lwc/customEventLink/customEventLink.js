import { LightningElement, track } from "lwc";
import {
  APPLICATION_SCOPE,
  createMessageContext,
  releaseMessageContext,
  subscribe as subscribeMessageChannel,
  unsubscribe as unsubscribeMessageChannel
} from "lightning/messageService";
import MC_FIRE_CUSTOM_EVENT from "@salesforce/messageChannel/msmxSheet__fireCustomEvent__c";
/**
 *
 */
const MESSAGE_CHANNELS = {
  fireCustomEvent: MC_FIRE_CUSTOM_EVENT
};
/**
 *
 */
export default class CustomEventLink extends LightningElement {
  messageContext;

  subscriptions = [];

  @track record;

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
    if (message.eventName === "accommodationDetail") {
      const record = {
        ...message.record,
        amenities: message.record.Amenities__c
          ? message.record.Amenities__c.split(";")
          : []
      };
      this.record = record;
    }
  }
}