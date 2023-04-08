class ChartJSUtil {

    id;
    width;
    height;
    chartType;


    constructor(id, width, height, chartType) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.chartType = chartType;

    }
 
    chart(data)  {

        const spec = {
             type: `${this.chartType}`,
             data
        };

        let chartHtml = `
        <canvas id="${this.id}" width="${this.width}" height="${this.height}"></canvas>

        <script>

        const ctx = document.getElementById('${this.id}').getContext('2d');
        const myChart = new Chart(ctx, ${JSON.stringify(spec, null, 4 )} );
        </script>

        `;

        return chartHtml;

       

    }
}