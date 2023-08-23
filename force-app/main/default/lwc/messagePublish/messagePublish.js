import { LightningElement } from "lwc";
import {
  createMessageContext,
  releaseMessageContext,
  publish,
	subscribe,
	unsubscribe
} from "lightning/messageService";
import MC_SET_PARAMETERS from "@salesforce/messageChannel/msmxSheet__setParameters__c";
import MC_EXECUTE_COMMAND from "@salesforce/messageChannel/msmxSheet__executeCommand__c";
import MC_LOAD_COMPLETE from "@salesforce/messageChannel/msmxSheet__loadComplete__c";

/**
 *
 *
 */
const MESSAGE_CHANNELS = {
  setParameters: MC_SET_PARAMETERS,
  executeCommand: MC_EXECUTE_COMMAND
};

const getMessageTemplates = (componentId, bookId) => ({
  setParameters: [
    {
      id: "template01",
      label: "Template #1",
      template: {
        parameters: {
          type: "Hotel",
          name: "Boutique Inn"
        }
      }
    },
    {
      id: "template02",
      label: "Template #2",
      template: {
        parameters: {
          type: ["Hotel", "Guesthouse"]
        },
        partial: true,
        forceLoad: false
      }
    }
  ],
  executeCommand: [
    {
      id: "focusSheet",
      label: "Focus Sheet",
      template: {
        componentId,
        command: "focusSheet",
        arguments: {
          bookId,
          sheetId: "s3"
        }
      }
    },
    {
      id: "saveRecords",
      label: "Save Records",
      template: {
        componentId,
        command: "saveRecords",
        arguments: {
          bookId,
          sheetId: "s1"
        }
      }
    }
  ]
});

export default class MessagePublish extends LightningElement {
  messageContext;

  messageChannelName = Object.keys(MESSAGE_CHANNELS)[0];

  messageTemplateId = undefined;

  messagePayload = "";

	componentId = "comp-001";

	bookId = "your book ID here";

  get messageChannelOptions() {
    return Object.keys(MESSAGE_CHANNELS).map((name) => ({
      label: name,
      value: name
    }));
  }

  get messageTemplateOptions() {
    return getMessageTemplates(this.componentId, this.bookId)[this.messageChannelName].map(
      ({ id, label }) => ({ label, value: id })
    );
  }

  connectedCallback() {
    this.messageContext = createMessageContext();
		// just for getting book ID in the page
		const subscr = subscribe(this.messageContext, MC_LOAD_COMPLETE, ({ componentId, bookId }) => {
			if (componentId) {
				this.componentId = componentId;
			}
			if (bookId) {
				this.bookId = bookId;
			}
			unsubscribe(subscr);
		});
  }

  disconnectedCallback() {
    if (this.messageContext) {
      releaseMessageContext(this.messageContext);
    }
    this.messageContext = null;
  }

  handleSelectMessageChannel(event) {
    if (event.detail.value) {
      this.messageChannelName = event.detail.value;
      this.messageTemplateId = undefined;
    }
  }

  handleSelectMessageTemplate(event) {
    const templateId = event.detail.value;
    if (templateId) {
      this.messageTemplateId = templateId;
      const templateEntry = getMessageTemplates(this.componentId, this.bookId)[
        this.messageChannelName
      ].find((entry) => entry.id === templateId);
      if (templateEntry) {
        this.messagePayload = JSON.stringify(templateEntry.template, null, 2);
      }
    }
  }

  handleChangeMessagePayload(event) {
    this.messagePayload = event.detail.value;
  }

  handlePublishMessage() {
    const message = JSON.parse(this.messagePayload);
    publish(
      this.messageContext,
      MESSAGE_CHANNELS[this.messageChannelName],
      message
    );
  }
}
