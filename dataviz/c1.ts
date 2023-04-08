import { Chart } from "chart.js";
const BORDER_WIDTH = 3;

var ctx = document.getElementById("myChart") as HTMLCanvasElement;
var myChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["green", "yellow", "green", "purple", "blue"],
    datasets: [
      {
        weight: 1,
        data: [50, 600, 200],
        backgroundColor: ["green", "purple", "blue"],
        borderColor: (ctx) => {
          console.log(ctx.dataIndex);
          return ctx.dataIndex === 0 ? "green" : "rgba(255, 255, 255, 1)";
        },
        borderWidth: BORDER_WIDTH,
      },
    ],
  },
  options: {
    responsive: true,
  },
});

// console.log(myChart.generateLegend());
