var barOptions_stacked = {
    hover :{
        animationDuration:10
    },
    scales: {
        xAxes: [{
            label:"Duration",
            ticks: {
                beginAtZero:true,
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize:11
            },
            scaleLabel:{
                display:false
            },
            gridLines: {
            }, 
            stacked: true
        }],
        yAxes: [{
            gridLines: {
                display:false,
                color: "#fff",
                zeroLineColor: "#fff",
                zeroLineWidth: 0
            },
            ticks: {
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize:11
            },
            stacked: true
        }]
    },
    legend:{
        display:false
    },
};

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {    
    type: 'horizontalBar',
    data: {
        labels: ["Discovery", "Gather requirements", "POC", "Develop"],
        
        datasets: [{
            data: [50,150, 300, 400, 500],
            backgroundColor: "rgba(63,103,126,0)",
            hoverBackgroundColor: "rgba(50,90,100,0)"
            
        },{
            data: [100, 100, 200, 200, 100],
            backgroundColor: ['red', 'green', 'blue', 'yellow'],
        }]
    },
    options: barOptions_stacked,
});

// this part to make the tooltip only active on your real dataset
var originalGetElementAtEvent = myChart.getElementAtEvent;
myChart.getElementAtEvent = function (e) {
    return originalGetElementAtEvent.apply(this, arguments).filter(function (e) {
        return e._datasetIndex === 1;
    });
}
