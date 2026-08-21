import { LightningElement, api, wire } from "lwc";
import getBooks from "@salesforce/apex/SheetPlaygroundController.getBooks";
import getSheets from "@salesforce/apex/SheetPlaygroundController.getSheets";

const DEFAULT_COMPONENT_ID_PREFIX = "sheet-integration-example";
const DEFAULT_COMPONENT_TITLE = "Example";
const DEFAULT_COMPONENT_HEIGHT = "500px";
let nextComponentInstanceId = 0;

const createDefaultComponentId = () =>
  `${DEFAULT_COMPONENT_ID_PREFIX}-${Date.now().toString(
    36
  )}-${++nextComponentInstanceId}`;

export default class SheetPlayground extends LightningElement {
  _recordId;
  defaultComponentId = createDefaultComponentId();

  bookOptions = [];
  sheetOptions = [];
  eventLogs = [];

  draft = {
    bookId: "",
    sheetId: "",
    componentId: this.defaultComponentId,
    title: DEFAULT_COMPONENT_TITLE,
    height: DEFAULT_COMPONENT_HEIGHT,
    publishEvents: true,
    parameters: "",
    contextRecordId: ""
  };

  applied = {
    bookId: "",
    sheetId: "",
    componentId: this.defaultComponentId,
    title: "",
    height: DEFAULT_COMPONENT_HEIGHT,
    publishEvents: true,
    parameters: "",
    contextRecordId: ""
  };

  sheetDisabled = true;
  selectedRecordId = "";
  selectedRecordIds = "";
  nextEventId = 1;
  logLevels = {
    INFO: "Info",
    ERROR: "Error"
  };

  @api
  get recordId() {
    return this._recordId;
  }

  set recordId(value) {
    this._recordId = value;

    if (!this.draft.contextRecordId && !this.applied.contextRecordId && value) {
      this.draft.contextRecordId = value;
      this.applied.contextRecordId = value;
    }
  }

  get selectedRecordActionDisabled() {
    return !this.selectedRecordId;
  }

  get pageRecordIdDisplay() {
    return this.recordId || "-";
  }

  get selectedRecordIdDisplay() {
    return this.selectedRecordId || "-";
  }

  get selectedRecordIdsDisplay() {
    return this.selectedRecordIds || "-";
  }

  @wire(getBooks)
  wiredBooks({ error, data }) {
    if (data) {
      this.bookOptions = data.map((book) => ({
        label: book.Name,
        value: book.Id
      }));
    } else if (error) {
      this.bookOptions = [];
      this.addEventLog(
        "Unable to load books from msmxSheet__msmxBook__c",
        this.logLevels.ERROR,
        {
          message: error.body?.message || error.message
        }
      );
    }
  }

  loadSheets(bookId) {
    getSheets({ bookId })
      .then((data) => {
        this.sheetOptions = data.map((sheet) => ({
          label: sheet.Name,
          value: sheet.msmxSheet__SheetId__c
        }));

        if (
          !this.sheetOptions.some(
            (option) => option.value === this.draft.sheetId
          )
        ) {
          this.draft.sheetId = "";
        }

        this.sheetDisabled = this.sheetOptions.length === 0;
      })
      .catch((error) => {
        this.sheetOptions = [];
        this.draft.sheetId = "";
        this.sheetDisabled = true;
        this.addEventLog(
          `Unable to load sheets for book ${bookId}`,
          this.logLevels.ERROR,
          {
            bookId,
            message: error.body?.message || error.message
          }
        );
      });
  }

  handleBookChange(event) {
    this.draft.bookId = event.detail.value;
    this.draft.sheetId = "";
    this.sheetOptions = [];
    this.sheetDisabled = true;

    if (this.draft.bookId) {
      this.loadSheets(this.draft.bookId);
    }

    this.addEventLog("Book draft changed", this.logLevels.INFO, {
      bookId: this.draft.bookId
    });
  }

  handleSheetChange(event) {
    this.draft.sheetId = event.detail.value;
    this.addEventLog("Sheet draft changed", this.logLevels.INFO, {
      sheetId: this.draft.sheetId
    });
  }

  handleComponentTitleChange(event) {
    this.draft.title = event.detail.value;
    this.addEventLog("Component title draft changed", this.logLevels.INFO, {
      componentTitle: this.draft.title
    });
  }

  handleComponentHeightChange(event) {
    this.draft.height = event.detail.value || DEFAULT_COMPONENT_HEIGHT;
    this.addEventLog("Component height draft changed", this.logLevels.INFO, {
      componentHeight: this.draft.height
    });
  }

  handlePublishEventsChange(event) {
    this.draft.publishEvents = event.target.checked;
    this.addEventLog("Publish events draft changed", this.logLevels.INFO, {
      publishEvents: this.draft.publishEvents
    });
  }

  handleParametersChange(event) {
    this.draft.parameters = event.detail.value;
    this.addEventLog("Parameters draft changed", this.logLevels.INFO, {
      parameters: this.draft.parameters
    });
  }

  handleContextRecordIdChange(event) {
    this.draft.contextRecordId = event.detail.value;
    this.applied.contextRecordId = this.draft.contextRecordId;
    this.addEventLog("Context record changed", this.logLevels.INFO, {
      contextRecordId: this.applied.contextRecordId
    });
  }

  handleUseSelectedRecord() {
    if (!this.selectedRecordId) {
      return;
    }
    this.draft.contextRecordId = this.selectedRecordId;
    this.applied.contextRecordId = this.draft.contextRecordId;
    this.addEventLog(
      "Context record set from selected record",
      this.logLevels.INFO,
      {
        contextRecordId: this.applied.contextRecordId,
        source: "selectedRecord"
      }
    );
  }

  handleResetContextRecord() {
    this.draft.contextRecordId = this.recordId || "";
    this.applied.contextRecordId = this.draft.contextRecordId;
    this.addEventLog("Context record reset", this.logLevels.INFO, {
      contextRecordId: this.applied.contextRecordId,
      source: "pageRecord"
    });
  }

  handleApplySettings() {
    this.applied = { ...this.draft };
    this.applied.contextRecordId =
      this.draft.contextRecordId || this.recordId || "";

    this.addEventLog("Settings applied", this.logLevels.INFO, {
      ...this.applied
    });
  }

  handleClearLog() {
    this.eventLogs = [];
  }

  handleSelectRecord(event) {
    const { recordId, recordIds } = event.detail;
    this.selectedRecordId = recordId || "";
    this.selectedRecordIds = Array.isArray(recordIds)
      ? recordIds.join(", ")
      : recordIds || "";
    this.addEventLog("Record selected", this.logLevels.INFO, event.detail);
  }

  addEventLog(message, level = this.logLevels.INFO, detail = "") {
    const timestamp = new Date().toLocaleTimeString();
    this.eventLogs = [
      {
        id: this.nextEventId++,
        time: timestamp,
        level,
        eventClass:
          level === this.logLevels.ERROR
            ? "event-level event-log-error"
            : "event-level event-log-info",
        message,
        detail: this.formatEventDetail(detail)
      },
      ...this.eventLogs
    ];
  }

  formatEventDetail(detail) {
    if (detail === null || detail === undefined || detail === "") {
      return "";
    }

    if (typeof detail === "string") {
      return detail;
    }

    try {
      return JSON.stringify(detail, null, 2);
    } catch (error) {
      return String(detail);
    }
  }
}
