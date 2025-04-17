import { LightningElement, api } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import getAnnualRevenue from "@salesforce/apex/AccountDynamicInteractionController.getAnnualRevenue";
import chartJs from "@salesforce/resourceUrl/MsmxChartJS";

export default class AccountChartDI extends LightningElement {
  _recordId;
  chart;
  totalRevenue = 0;

  @api
  get recordId() {
    return this._recordId;
  }

  set recordId(value) {
    this._recordId = value;
    if (this.chart) {
      this.chart.destroy();
      this.initializeChart();
    }
  }

  renderedCallback() {
    if (this.chart) {
      return;
    }
    loadScript(this, chartJs)
      .then(() => {
        this.initializeChart();
      })
      .catch((error) => {
        console.error("Error loading Chart.js:", error);
      });
  }

  initializeChart() {
    getAnnualRevenue({ recordId: this.recordId }).then((annualData) => {
      const years = annualData.map((item) => item.year);
      const values = annualData.map((item) => item.amount);
      const ctx = this.template.querySelector("canvas");
      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: years,
          datasets: [
            {
              label: "Total Amount",
              data: values,
              backgroundColor: "rgba(54, 162, 235, 0.6)"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const data = annualData[elements[0].index];
              const startDate = data.startDate;
              const endDate = data.endDate;
              const year = data.year;

              const payload = {
                accountId: this._recordId,
                startDate: startDate,
                endDate: endDate,
                year: year
              };
              console.log(JSON.stringify(payload));
              this.dynamicInteractionEvent("clickchart", payload);
            }
          }
        }
      });
      ctx.addEventListener("click", (event) => {
        this.clickableScales(ctx, event);
      });
    });
  }

  clickableScales(ctx, event) {
    const xScale = this.chart.scales.x;
    const top = xScale.top;
    const bottom = xScale.bottom;
    const left = xScale.left;
    const labelWidth = xScale.width / xScale.ticks.length;

    let rect = ctx.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (let i = 0; i < xScale.ticks.length; i++) {
      const labelLeft = left + labelWidth * i;
      const labelRight = labelLeft + labelWidth;

      if (x >= labelLeft && x <= labelRight && y >= top && y <= bottom) {
        const year = Number(xScale.ticks[i].label);

        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const payload = {
          accountId: this._recordId,
          year,
          startDate,
          endDate
        };

        this.dynamicInteractionEvent("clickchart", payload);
      }
    }
  }

  dynamicInteractionEvent(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, { detail: detail, bubbles: true, composed: true })
    );
  }
}
