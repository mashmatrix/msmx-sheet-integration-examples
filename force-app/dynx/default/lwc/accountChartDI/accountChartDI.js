import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import getAnnualRevenue from '@salesforce/apex/AccountDynamicInteractionController.getAnnualRevenue';
import chartJs from '@salesforce/resourceUrl/MsmxChartJS';

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
      .catch(error => {
        console.error('Error loading Chart.js:', error);
      });
  }

  initializeChart() {
    getAnnualRevenue({ recordId: this.recordId }).then(annualRevenue => {
      if (this.chart) {
        this.updateChart([annualRevenue]);
        return;
      }

      const ctx = this.template.querySelector('canvas').getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Revenue'],
          datasets: [
            {
              label: 'Total Revenue',
              data: [annualRevenue],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  }

  updateChart(data) {
    if (this.chart) {
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }
  }
}