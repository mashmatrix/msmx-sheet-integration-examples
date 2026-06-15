import { LightningElement, track, wire } from "lwc";
import { MessageContext, publish } from "lightning/messageService";

import SET_PARAMETERS_CHANNEL from "@salesforce/messageChannel/msmxSheet__setParameters__c";

export default class SheetIntegrationExample extends LightningElement {
  @wire(MessageContext)
  messageContext;

  componentId = "sheet-integration-example";

  recordId = "500AAAAAAAAAAAA";

  bookId = "book-1";

  sheetId = "sheet-1";

  scenario = "managerReview";

  region = "apac";

  theme = "standard";

  enableRecommendation = true;

  enableAdvancedActions = false;

  nextEventId = 1;

  @track
  eventLogs = [];

  recordOptions = [
    {
      label: "Case A",
      value: "500AAAAAAAAAAAA"
    },
    {
      label: "Case B",
      value: "500BBBBBBBBBBBB"
    },
    {
      label: "Case C",
      value: "500CCCCCCCCCCCC"
    }
  ];

  bookOptions = [
    {
      label: "Sales",
      value: "book-1"
    },
    {
      label: "Service",
      value: "book-2"
    },
    {
      label: "Operations",
      value: "book-3"
    }
  ];

  sheetOptions = [
    {
      label: "Overview",
      value: "sheet-1"
    },
    {
      label: "Detail",
      value: "sheet-2"
    },
    {
      label: "Analytics",
      value: "sheet-3"
    }
  ];

  scenarioOptions = [
    {
      label: "Manager Review",
      value: "managerReview"
    },
    {
      label: "Agent Support",
      value: "agentSupport"
    },
    {
      label: "Executive Dashboard",
      value: "executiveDashboard"
    }
  ];

  regionOptions = [
    {
      label: "APAC",
      value: "apac"
    },
    {
      label: "EMEA",
      value: "emea"
    },
    {
      label: "AMER",
      value: "amer"
    }
  ];

  themeOptions = [
    {
      label: "Compact",
      value: "compact"
    },
    {
      label: "Standard",
      value: "standard"
    }
  ];

  get initialParameters() {
    return [
      `scenario=${encodeURIComponent(this.scenario)}`,
      `region=${encodeURIComponent(this.region)}`,
      `theme=${encodeURIComponent(this.theme)}`,
      `enableRecommendation=${this.enableRecommendation}`,
      `enableAdvancedActions=${this.enableAdvancedActions}`
    ].join("&");
  }

  handleRecordChange(event) {
    this.recordId = event.detail.value;

    this.addEventLog(`Context changed: ${this.recordId}`);
  }

  handleBookChange(event) {
    this.bookId = event.detail.value;

    this.addEventLog(`Book changed: ${this.bookId}`);
  }

  handleSheetChange(event) {
    this.sheetId = event.detail.value;

    this.addEventLog(`Sheet changed: ${this.sheetId}`);
  }

  handleScenarioChange(event) {
    this.scenario = event.detail.value;
  }

  handleRegionChange(event) {
    this.region = event.detail.value;
  }

  handleThemeChange(event) {
    this.theme = event.detail.value;
  }

  handleRecommendationChange(event) {
    this.enableRecommendation = event.target.checked;
  }

  handleAdvancedActionsChange(event) {
    this.enableAdvancedActions = event.target.checked;
  }

  handleApplyParameters() {
    publish(this.messageContext, SET_PARAMETERS_CHANNEL, {
      componentId: this.componentId,
      parameters: {
        scenario: this.scenario,
        region: this.region,
        theme: this.theme,
        enableRecommendation: this.enableRecommendation,
        enableAdvancedActions: this.enableAdvancedActions
      },
      partial: true,
      forceLoad: true
    });

    this.addEventLog("Runtime parameters updated");
  }

  handleSelectRecord(event) {
    const { recordId, recordIds } = event.detail;

    this.addEventLog(`Record selected: ${recordId}`);

    if (recordIds) {
      this.addEventLog(`Selected records: ${recordIds}`);
    }
  }

  addEventLog(message) {
    const timestamp = new Date().toLocaleTimeString();

    this.eventLogs = [
      {
        id: this.nextEventId++,
        message: `[${timestamp}] ${message}`
      },
      ...this.eventLogs
    ];
  }
}
