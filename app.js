 // ============================================================
    // 1. DOM refs
    // ============================================================
    const timerEl = document.querySelector(".timer-time");
    const ao5Display = document.querySelector("#ao5-display");
    const ao12Display = document.querySelector("#ao12-display");
    const solvesTodayDisplay = document.querySelector("#solves");
    const scrambleText = document.querySelector(".scramble-text");

   
    const sessionMean = document.querySelector("#session-mean");
    const sessionBest = document.querySelector("#session-best");
    const sessionSolvesCount = document.querySelector("#session-solves-count");
    const sessionAo5 = document.querySelector("#session-ao5");
    const sessionAo12 = document.querySelector("#session-ao12");
    // const nameInput = document.querySelector(".session-input");
    // timer parts
    const secPart = document.getElementById("sec-part");
    const centiPart = document.getElementById("centi-part");
    const dotPart = document.querySelector(".dot");

    // ============================================================
    // 2. State
    // ============================================================
    let start;
    let elapsedTime = 0;
    let timerState = "idle";          // "idle" | "inspecting" | "ready" | "running"
    let inspectionTime = 0;           // seconds
    let inspectionIntervalId = null;
    let intervalId = null;

    let allSessions = [];
    let activeSessionId = null;
    let sessionSolves = [];           // solves of the active session (sorted newest first)
    
    const importBtn = document.getElementById("btn-import");
    const exportBtn = document.getElementById("btn-export");

// CHARTS - Enhanced with Cubolio theme colors
// ROW 1
const progressChart = document.querySelector("#progressChart");
const solveDistribution = document.querySelector("#solveDistribution");
const stabilityGauge=document.querySelector("#stabilityGauge");
const velocityChart=document.querySelector("#velocityChart");

const ctx = progressChart.getContext("2d");
const ctx1=velocityChart.getContext("2d");


 const gradientVel = ctx1.createLinearGradient(0,0,150,0);

gradientVel.addColorStop(0,"#00F5A0");
gradientVel.addColorStop(.4,"#00FF88");
gradientVel.addColorStop(.7,"#66FF99");
gradientVel.addColorStop(1,"#B8FF6A");

// Get computed styles for theme consistency
const styles = getComputedStyle(document.documentElement);
const electricBlue = styles.getPropertyValue('--electric-blue').trim() || '#2763fb';
const neonCyan = styles.getPropertyValue('--neon-cyan').trim() || '#27D8FF';
const softpink = styles.getPropertyValue('--soft-pink').trim() || "#C026FF";
const accentPurple = styles.getPropertyValue('--accent-purple').trim() || '#A24CFF';
const textMuted = styles.getPropertyValue('--text-muted').trim() || '#8A8C9E';

// Gradient for fill area
const gradient = ctx.createLinearGradient(0, 0, 0, 230);
gradient.addColorStop(0, `rgba(48, 76, 253, 0.35)`);
gradient.addColorStop(0.5, `rgba(39, 79, 255, 0.15)`);
gradient.addColorStop(1, `rgba(123, 93, 255, 0)`);

// Gradient for line border
const lineGradient = ctx.createLinearGradient(0, 0, 0, 150);
lineGradient.addColorStop(0, neonCyan);
lineGradient.addColorStop(0.5, electricBlue);
lineGradient.addColorStop(1, softpink);

// Glow effect for points
const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
glowGradient.addColorStop(0, 'rgba(59, 130, 255, 0.6)');
glowGradient.addColorStop(1, 'rgba(59, 130, 255, 0)');

// Neon Glow Plugin
const neonGlow = {
    id: "neonGlow",

    beforeDatasetDraw(chart) {
        const ctx = chart.ctx;

        ctx.save();
        ctx.shadowColor = "#8826ff";
        ctx.shadowBlur = 28;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalCompositeOperation = "color-dodge";
    },

    afterDatasetDraw(chart) {
        chart.ctx.restore();
    }
};
// Neon Gold Plugin
const neonGold = {
    id: "neonGold",

    beforeDatasetDraw(chart) {
        const ctx = chart.ctx;

        ctx.save();
        ctx.shadowColor = "#0077ff";
        ctx.shadowBlur = 28;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalCompositeOperation = "color-dodge";
    },

    afterDatasetDraw(chart) {
        chart.ctx.restore();
    }
};
const neonLine = {
    id: "neonLine",
    beforeDatasetsDraw(chart) {

        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);

        ctx.save();

        // Strong outer glow
        ctx.shadowColor = "#00FF88";
        ctx.shadowBlur = 22;
        ctx.lineWidth = 7;
        ctx.strokeStyle = "rgba(0,255,136,0.25)";
        meta.dataset.draw(ctx);

        // Medium glow
        ctx.shadowBlur = 14;
        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgba(0,255,136,0.45)";
        meta.dataset.draw(ctx);

        // Inner glow
        ctx.shadowBlur = 8;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(0,255,136,0.75)";
        meta.dataset.draw(ctx);

        ctx.restore();
    }
};
const areaGradient = ctx1.createLinearGradient(0,0,0,180);

areaGradient.addColorStop(0,"rgba(0,255,136,.22)");
areaGradient.addColorStop(.4,"rgba(0,255,136,.08)");
areaGradient.addColorStop(1,"rgba(0,255,136,0)");
// Gradient
const gradientbar = ctx.createLinearGradient(0, 0, 0, 275);
gradientbar.addColorStop(0.00, "#C026FF");
gradientbar.addColorStop(0.35, "#8B2EFF");
gradientbar.addColorStop(0.70, "#4A36FF");
gradientbar.addColorStop(1.00, "#1E4DFF");

// Chart
const valueLabels = {
    id: "valueLabels",
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);

        ctx.save();

        ctx.font = "500 15px Inter";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        meta.data.forEach((bar, i) => {
            const value = dataset.data[i];

            // Glow
            ctx.shadowColor = "rgba(255,255,255,0.45)";
            ctx.shadowBlur = 10;

            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(
                value + "%",
                bar.x,
                bar.y - 7.5,
            );
        });

        ctx.restore();
    }
};
let velocity_Chart=new Chart(velocityChart,{
    type:"line",
   // plugins:[neonLine],
    data:{
        labels:[],
        datasets:[{
            data:[],
            borderColor:gradientVel,
            fill:true,
            backgroundColor:areaGradient,
            borderWidth:2,
            tension:.45,
            pointRadius:0,
           
        }]
    },
    options:{
        responsive:true,
        maintainAspectRatio:false,
        
        plugins:{
            legend:{display:false},
            tooltip:{enabled:false},
        },
        scales:{
            x:{display:false},
            y:{display:false},
        },
        elements:{
            line:{
                capBezierPoints:true
            }
        }
    }
});
let solve_Distribution = new Chart(solveDistribution, {
    type: "bar",
    plugins: [neonGlow,valueLabels],
    data: {
        labels: [],

        datasets: [{
            data: [],
            backgroundColor: gradientbar,
            borderColor: "#24004a",
            borderWidth: 1.2,
           
            borderSkipped: false,
             barPercentage: 0.80,
            categoryPercentage: 0.60,
            borderRadius: 10
        }]
    },

    options: {
        layout: {
            padding: {
                left: 30,
                right: 30
            },
        },
        responsive: true,
        maintainAspectRatio: true,

        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(15, 18, 35, 0.92)",
                borderColor: "rgba(192, 38, 255, 0.35)",
                borderWidth: 1,
                titleColor: "#FFFFFF",
                bodyColor: "#f700ff",

                cornerRadius: 8,
                padding: 10,

                displayColors: false,
                caretSize: 8,
                caretPadding: 10,

                callbacks: {
                    title(context) {
                        return context[0].label;
                    },

                    label(context) {
                        return `${context.parsed.y} solves`;
                    },
                },
            },
        },

        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 40,
                border: { display: false },
                grid: {display:false},
                ticks: {
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                        weight: '500',
                    },
                    color:"#9CA3AF",
                },
            },

            x: {
                border: { display: false },
                grid: { display: false },
                ticks: {
                    color:"#9CA3AF",
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                        weight: '500',
                    },
                    maxRotation: 0,
                    minRotation: 0
                },
                    
            }
        }
    }
});

const horizontalGuideLines = {
    id: "horizontalGuideLines",

    beforeDatasetsDraw(chart) {

        const { ctx, scales } = chart;

        ctx.save();

        ctx.strokeStyle = "rgba(39,216,255,.10)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5,5]);

        scales.y.ticks.forEach(tick => {

            const y = scales.y.getPixelForValue(tick.value);

            ctx.beginPath();
            ctx.moveTo(scales.x.left, y);
            ctx.lineTo(scales.x.right, y);
            ctx.stroke();

        });

        ctx.restore();
    }
};
let Prog_chart = new Chart(progressChart, {
    type: "line",
    plugins:[horizontalGuideLines],
    data: {
            labels: [],
        datasets: [{
           data: [],
                    tension: 0.15,
            backgroundColor: gradient,
            fill: true,
            pointRadius: 3,        // Reduced from 5
            pointBorderWidth: 1.5, // Reduced from 2
            pointBorderColor: '#FFFFFF',
            pointBackgroundColor: electricBlue,
            borderWidth: 3,        // Reduced from 3
            borderColor: lineGradient,
            pointHoverRadius: 6,   // Reduced from 9
            pointHoverBorderWidth: 2, // Reduced from 3
            pointHoverBorderColor: '#FFFFFF',
            pointHoverBackgroundColor: neonCyan,
            borderCapStyle: "round",
            borderJoinStyle: "round",
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(16, 23, 45, 0.85)',
                backdropFilter: 'blur(12px)',
                borderColor: 'rgba(59, 130, 255, 0.2)',
                borderWidth: 1,
                titleColor: '#FFFFFF',
                bodyColor: neonCyan,
                cornerRadius: 8,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y}s`;
                    }
                }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 12,
                border: { display: false },
                grid: {display:false},
                ticks: {
                    color: textMuted,
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                        weight: '500',
                    },
                    stepSize: 2,
                    callback: function(value) {
                        return value + 's';
                    }
                }
            },
            x: {
                border: { display: false },
                grid: { display: false },
                ticks: {
                    color: textMuted,
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                        weight: '500',
                    },
                    maxRotation: 0,
                    minRotation: 0
                }
            }
        },
        elements: {
            point: {
                hoverRadius: 7,      // Reduced from 10
                hoverBorderWidth: 2, // Reduced from 3
            },
            line: {
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
        },
    },
    plugins: [{
        afterDraw: function(chart) {
            const meta = chart.getDatasetMeta(0);
            const data = chart.data.datasets[0].data;
            const ctx = chart.ctx;

            meta.data.forEach((point, index) => {
                const value = data[index];
                if (value > 0) {
                    const gradientGlow = ctx.createRadialGradient(
                        point.x, point.y, 0,
                        point.x, point.y, 15  // Reduced from 20
                    );
                    gradientGlow.addColorStop(0, `rgba(59, 130, 255, 0.3)`);
                    gradientGlow.addColorStop(1, `rgba(59, 130, 255, 0)`);

                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 15, 0, Math.PI * 2); // Reduced from 20
                    ctx.fillStyle = gradientGlow;
                    ctx.fill();

                    if (value === Math.max(...data)) {
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2); // Reduced from 8
                        ctx.fillStyle = 'rgba(39, 216, 255, 0.15)';
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(point.x, point.y, 9, 0, Math.PI * 2); // Reduced from 12
                        ctx.strokeStyle = 'rgba(39, 216, 255, 0.2)';
                        ctx.lineWidth = 0.8; // Reduced from 1
                        ctx.setLineDash([2, 4]); // Reduced from [3, 5]
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                }
            });
        }
    }]
});
const ctx2=stabilityGauge.getContext('2d');
const gradient_gauge=ctx2.createLinearGradient(0,0,180,0);
gradient_gauge.addColorStop(0,"#8a2cfc");
gradient_gauge.addColorStop(.5,"#44c7ff");
gradient_gauge.addColorStop(1,"#17e8b4");
const centerText={
    id:"centerText",
    afterDraw(chart){
        const stats = chart.stats;
        if (!stats) return;
        const {ctx}=chart;
        const dataset = chart.getDatasetMeta(0);
        if(!dataset.data.length){
            return;
        }
        const meta = dataset.data[0];
        const x = meta.x;
        const y = meta.y;
        ctx.save();
        ctx.textAlign="center";
        ctx.fillStyle="#FFFFFF";
        ctx.font="600 50px 'Inter'";
        ctx.fillText(Math.round(stats.stability),x,y+10);
        ctx.font="16px Inter";
        ctx.fillStyle="rgba(255,255,255,.6)";
        ctx.fillText("/100",x,y+35);

        let label="Poor";
        if(stats.stability>=85){
            label="Excellent";
        }
        else if(stats.stability>=70){
            label="Good";
        }
        else if(stats.stability>=50){
            label="Average";
        }

        ctx.font="600 16px Inter";
        ctx.fillStyle="#44c7ff";
        ctx.fillText(label,x,y+60);
        ctx.restore();
    }
}
let stability_Gauge=new Chart(stabilityGauge,{
    type:"doughnut",
    
    data:{
        datasets:[{
            data:[],
           backgroundColor:[
                gradient_gauge,
                "rgba(255,255,255,.06)"
            ],
            borderWidth:0,
            borderRadius:15,
            spacing:2,
        }]
    },
    options:{
        radius:"90%",
        responsive:true,
        maintainAspectRatio:false,
        rotation:225,
        circumference:270,
        cutout:"75%",
        plugins:{
            legend:{
                display:false
            },
            tooltip:{
                enabled:false
            }
        },
         animation:{
            animateRotate:true,
            duration:1200,
            easing:"easeOutQuart"
        }

    },
    plugins:[centerText],
   
});
const neonPurple = {
    id:"neonPurple",
    beforeDatasetsDraw(chart){
        const {ctx} = chart;
        const meta = chart.getDatasetMeta(0);
        ctx.save();
        ctx.shadowColor="#D14DFF";
        ctx.shadowBlur=18;
        meta.dataset.draw(ctx);
        ctx.restore();
    }
};
const PBTime = document.querySelector("#pbTime");
const ctx3 = PBTime.getContext("2d");

// ==================== Gradients ====================

const gradientPB = ctx3.createLinearGradient(0, 0, 400, 0);
gradientPB.addColorStop(0, "#FF4DFF");
gradientPB.addColorStop(.5, "#C44DFF");
gradientPB.addColorStop(1, "#7B61FF");
// ==================== Chart ====================
let PB_Time = new Chart(PBTime, {
    type: "line",
    plugins:[horizontalGuideLines],
    data: {
        labels: [],
        
        datasets: [{
            data: [],
            stepped:true,
            borderColor: gradientPB,
            
            fill: false,
            tension: .1,
            borderWidth: 3,
            pointRadius: 4,
            pointBorderWidth: 1.5,
            pointBorderColor: "#dc19ff",
            pointBackgroundColor: "#ffffff",
            pointHoverRadius: 6,
            pointHoverBorderWidth: 2,
            pointHoverBorderColor: "#FFFFFF",
            pointHoverBackgroundColor: "#FF4DFF",
            borderCapStyle: "round",
            borderJoinStyle: "round"
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: "rgba(16,23,45,.85)",
                borderColor: "rgba(196,77,255,.25)",
                borderWidth: 1,
                titleColor: "#FFFFFF",
                bodyColor: "#FF7BFF",
                cornerRadius: 8,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return context.parsed.y.toFixed(2) + "s";
                    }
                }
            }
        },

        scales: {

            y: {
                min: 12,
                max: 20,
                border: {
                    display: false
                },

                grid: {
                    display:false,
                },

                ticks: {
                    color: textMuted,
                    stepSize: 2,
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                        weight: "500"
                    },

                    callback: function (value) {
                        return value + "s";
                    }
                }
            },

            x: {
                border: {
                    display: false
                },
                grid: {
                    display: false
                },
                ticks: {
                    color: textMuted,
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                        weight: "500"
                    }
                }
            }
        },
        elements: {
            point: {
                hoverRadius: 7,
                hoverBorderWidth: 2
            },
            line: {
                borderCapStyle: "round",
                borderJoinStyle: "round"
            }
        },
        animation: {
            duration: 1000,
            easing: "easeInOutQuart"
        }

    },
    plugins: [{
        afterDraw: function (chart) {
            const meta = chart.getDatasetMeta(0);
            const data = chart.data.datasets[0].data;
            const ctx = chart.ctx;
            meta.data.forEach((point, index) => {
                const value = data[index];
                // Glow
                const gradientGlow = ctx.createRadialGradient(
                    point.x,
                    point.y,
                    0,
                    point.x,
                    point.y,
                    15
                );
                gradientGlow.addColorStop(0, "rgba(196,77,255,.35)");
                gradientGlow.addColorStop(1, "rgba(196,77,255,0)");
                ctx.beginPath();
                ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
                ctx.fillStyle = gradientGlow;
                ctx.fill();
                // Value label
                ctx.save();
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "600 11px Inter";
                ctx.textAlign = "center";
                ctx.fillText(
                    value.toFixed(2),
                    point.x,
                    point.y - 14
                );
                ctx.restore();
                // Highlight latest PB
                if (index === data.length - 1) {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(255,77,255,.18)";
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 9, 0, Math.PI * 2);
                    ctx.strokeStyle = "rgba(255,77,255,.25)";
                    ctx.lineWidth = 1;
                    ctx.setLineDash([2, 4]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.fillStyle = "#FF4DFF";
                    ctx.font = "700 11px Inter";
                    ctx.textAlign = "left";
                    ctx.fillText(
                        "New PB!",
                        point.x + 12,
                        point.y + 18
                    );
                }
            });
        }
    }]
});

const practiceAllocation=document.querySelector("#practiceAllocation");
const ctx5=practiceAllocation.getContext("2d");
const gradientPractice = ctx5.createLinearGradient(0,0,0,150);

gradientPractice.addColorStop(0,"#3ed2ff");
gradientPractice.addColorStop(.5,"#3c80ff");
gradientPractice.addColorStop(1,"#8000ff");

let Practice_Allocation=new Chart(practiceAllocation,{
    type:"bar",
    plugins:[neonGold],
    animation:{
         duration:1200,
        easing:"easeOutQuart"
    },
    data:{
        labels:[],
        datasets:[{ 
            data:[],
       
        backgroundColor:gradientPractice,
          //  backgroundColor: gradientbar,
            borderColor: "#24004a",
            borderWidth: 1.2,
            borderRadius: 7,
            borderSkipped: false,
            barPercentage: 0.75,
            categoryPercentage: 0.75,
         }],
    },
    options:{
        layout: {
            padding: {
                top: 30,
                right: 4,
                bottom: 1,
                left: 18
            }
        },
        indexAxis:"y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(16, 23, 45, 0.85)',
                backdropFilter: 'blur(12px)',
                borderColor: 'rgba(59, 130, 255, 0.2)',
                borderWidth: 1,
                titleColor: '#FFFFFF',
                bodyColor: neonCyan,
                cornerRadius: 8,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y}s`;
                    }
                }
            }
        },
        scales:{
            x:{
                min:0,
                max:60,

                border:{
                    display:false
                },

                grid:{
                    color:"rgba(255,255,255,.05)"
                },

                ticks:{    
                    padding: 2,
                    color:textMuted,
                    callback:v=>v+"%"
                }
            },
            y:{
                border:{
                    display:false
                },

                grid:{
                    display:false
                },

                ticks:{
                    padding: 2,
                    color:"#9CA3AF",
                    font:{
                        size:14,
                        weight:"600"
                    }
                }
            }
        }
    }
})
const neonBell={
    id:"neonBell",
    beforeDatasetsDraw(chart){
        const {ctx}=chart;
        const meta=chart.getDatasetMeta(0);
        ctx.save();
        ctx.shadowColor="#FF4FD8";
        ctx.shadowBlur=20;
        meta.dataset.draw(ctx);
        ctx.restore();
    }
};
const pbMarker={
    id:"pbMarker",
    afterDatasetsDraw(chart){
        const stats = chart.stats;
        if(!stats) return;
        const {ctx,scales}=chart;
        const pb=stats.bestSingle;
        if (pb == null) return;
        const x=scales.x.getPixelForValue(pb);
        const peak=Math.max(...stats.bellCurve.map(x=>x.y));
        const y=scales.y.getPixelForValue(peak);
        ctx.save();
        // dashed line
        ctx.strokeStyle="rgba(255,79,216,.45)";
        ctx.setLineDash([4,4]);
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(x,scales.y.bottom);
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.setLineDash([]);

        // glow
        const g=ctx.createRadialGradient(
            x,y,0,
            x,y,18
        );
        g.addColorStop(0,"rgba(255,79,216,.6)");
        g.addColorStop(1,"rgba(255,79,216,0)");
        ctx.beginPath();
        ctx.arc(x,y,18,0,Math.PI*2);
        ctx.fillStyle=g;
        ctx.fill();
        // point
        ctx.beginPath();
        ctx.arc(x,y,4.5,0,Math.PI*2);
        ctx.fillStyle="#FFFFFF";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x,y,7,0,Math.PI*2);
        ctx.strokeStyle="#FF4FD8";
        ctx.lineWidth=2;
        ctx.stroke();
        // PB
        ctx.fillStyle="#FF4FD8";
        ctx.font="700 18px Inter";
        ctx.textAlign="center";
        ctx.fillText("PB",x,y-18);
        ctx.restore();
    }

};
const guideLines={
    id:"guideLines",
    beforeDatasetsDraw(chart){
        const {ctx,scales}=chart;
        ctx.save();
        ctx.strokeStyle="rgba(255,255,255,.08)";
        ctx.lineWidth=1;
        ctx.setLineDash([3,4]);
        [14,16].forEach(v=>{
            const x=scales.x.getPixelForValue(v.toFixed(1));
            ctx.beginPath();
            ctx.moveTo(x,scales.y.bottom);
            ctx.lineTo(x,scales.y.top+18);
            ctx.stroke();
        });
        ctx.restore();
    }
};
const pbProbability=document.querySelector("#pbProbability");
const ctx6=pbProbability.getContext("2d");
const gradientPBLine=ctx6.createLinearGradient(0,0,350,0);
gradientPBLine.addColorStop(0,"#FF4FD8");
gradientPBLine.addColorStop(.5,"#FF73F7");
gradientPBLine.addColorStop(1,"#C44DFF");

const gradientArea=ctx6.createLinearGradient(0,0,0,180);
gradientArea.addColorStop(0,"rgba(255,79,216,.30)");
gradientArea.addColorStop(.5,"rgba(196,77,255,.12)");
gradientArea.addColorStop(1,"rgba(196,77,255,0)");
// const bellLabels=[];
// const bell=[];
// for(let x=12; x<=18; x+=0.1){
//     bellLabels.push(x.toFixed(1));
//     const y = Math.exp(
//         -Math.pow(x-15,2)/(2*1.15*1.15)
//     );
//     bell.push(y);
// }
let PB_BellCurve=new Chart(pbProbability,{
    type:"line",
    plugins:[neonBell,guideLines,pbMarker],
    data:{
        labels:[],
        datasets:[{
            data:[],
            borderColor:gradientPBLine,
            backgroundColor:gradientArea,
            fill:true,
            tension:0.45,
            borderWidth:3,
            pointRadius:0,
            borderCapStyle:"round",
            borderJoinStyle:"round",
            clip:false,
        }]
    },
    options:{
         layout: {
            padding: {
                top: 15,
            }
        },
        responsive:true,
        maintainAspectRatio:false,
        plugins:{
            legend:{
                display:false
            },
            tooltip:{
                enabled:false
            }
        },
        scales:{
            x:{
                grid:{
                    display:false
                },

                border:{
                    display:false
                },
                ticks:{
                    color:textMuted,
                    callback:function(value,index){
                        const label = this.getLabelForValue(value);
                        return Number(label)%1===0 ? label+"s" : "";
                    },
                    maxRotation: 0,
                    minRotation: 0
                }
            },

            y:{
                display:false
            }
        },
        animation:{
            duration:1400,
            easing:"easeOutQuart"
        },
    }
})
const subX = document.querySelector("#sub-x");
const ctx7 = subX.getContext("2d");
const gradientGauge2 = ctx7.createLinearGradient(0,0,240,70);

gradientGauge2.addColorStop(0,"#ff1e00");
gradientGauge2.addColorStop(.5,"#FF9E00");
gradientGauge2.addColorStop(1,"#fbff00");
// Glow Plugin
const gaugeGlow = {
    id:"gaugeGlow",
    beforeDatasetsDraw(chart){
        const {ctx} = chart;
        const meta = chart.getDatasetMeta(0);
        ctx.save();
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#FFB000";
        meta.dataset.draw(ctx);
        ctx.restore();
    }
};
// Center Text
const centerText2 = {
    id:"centerText2",
    afterDraw(chart){
         const stats = chart.stats;
        if(!stats) return;

        const meta = chart.getDatasetMeta(0).data[0];
        if(!meta) return;

        const x = meta.x;
        const y = meta.y;

        const {ctx} = chart;
     
        ctx.save();
        ctx.textAlign = "center";
        // Percentage
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "700 45px Inter";
        ctx.fillText(Math.round(stats.subXSuccess),x-10,y+10);
        // Fraction
        ctx.font = "700 30px Inter";
        ctx.fillText("%",x+32,y+8);
        ctx.font = "600 12px Inter";
        ctx.fillStyle = "rgba(255,255,255,.92)";
        ctx.fillText(stats.validCount+"/"+stats.solveCount,x,y+33);
        // Label
        ctx.font = "600 12px Inter";
        ctx.fillStyle = "rgb(255, 185, 33)";
        
        ctx.fillText("Success Rate",x,y+45);
        ctx.restore();
    }
};
let subxGauge = new Chart(subX,{
    type:"doughnut",
    plugins:[centerText2 ],
    data:{
        datasets:[{
            data:[],
            backgroundColor:[
                gradientGauge2,
                "rgba(255,255,255,.08)"
            ],
            borderWidth:0,
            borderRadius:7,
            borderSkipped:false,
            spacing:2,
            hoverOffset:0,
            hoverBorderWidth:0,
        }]
    },

    options:{
        responsive:true,
        maintainAspectRatio:true,
        rotation:-Math.PI/2,
        circumference:360,
        cutout:"80%",
        plugins:{
            legend:{
                display:false
            },
            tooltip:{
                enabled:false
            }
        },
        animation:{
            animateRotate:true,
            duration:1500,
            easing:"easeOutQuart"
        }
    }
});

function updateCharts(){
    const stats=calculateStats(sessionSolves);
    const effectiveTimes=sessionSolves.map(getEffectiveTime);

    const progress=getProgressData(effectiveTimes,12);
    if(progress){
        Prog_chart.data.labels=progress.map(x=>x.x);
        Prog_chart.data.datasets[0].data=progress.map(x=>x.y/1000);
    }else{
        Prog_chart.data.labels=[];
        Prog_chart.data.datasets[0].data=[];
    }
    Prog_chart.update();

    const pb=getPBData(effectiveTimes);
    if(pb){
        PB_Time.data.labels=pb.map(x=>x.x);
        PB_Time.data.datasets[0].data=pb.map(x=>x.y/1000);
    }else{
        PB_Time.data.labels=[];
        PB_Time.data.datasets[0].data=[];
    }
    PB_Time.update();

    const dist=getSolveDistribution(effectiveTimes);
    if (dist) {
        solve_Distribution.data.labels = dist.map(x => x.x);
        solve_Distribution.data.datasets[0].data = dist.map(x => x.y);
    }else{
         solve_Distribution.data.labels = [];
        solve_Distribution.data.datasets[0].data = [];
    }
    solve_Distribution.update();

    stability_Gauge.stats = stats;
    const stability = stats.stability ?? 0;
    stability_Gauge.data.datasets[0].data=[stability,100-stability];
    stability_Gauge.update();

    const vel=getProgressData(effectiveTimes,20);
    if(vel){
        velocity_Chart.data.labels=vel.map(x=>x.x);
        velocity_Chart.data.datasets[0].data=vel.map(x=>x.y/1000);
    }else{
         velocity_Chart.data.labels=[];
        velocity_Chart.data.datasets[0].data=[];
    }
    velocity_Chart.update();
    
    const bell = generateBellCurve(stats.mean,stats.stdDev)||[];

    PB_BellCurve.stats = stats;
    PB_BellCurve.data.labels=bell.map(x=>x.x.toFixed(2));
    PB_BellCurve.data.datasets[0].data=bell.map(x=>x.y);
    PB_BellCurve.update();

    subxGauge.stats = stats;
    const sub = stats.subXSuccess ?? 0;
    subxGauge.data.datasets[0].data=[sub,100-sub];
    subxGauge.update();
}
    // ============================================================
    // 3. Scramble (cubing.net)
    // ============================================================
    
    async function generateScramble() {
        try {
            const { randomScrambleForEvent } = await import("https://cdn.cubing.net/v0/js/cubing/scramble");
            const scramble = await randomScrambleForEvent("333");
            if (scrambleText) scrambleText.innerText = scramble.toString();
        } catch (e) {
            if (scrambleText) scrambleText.innerText = "R U R' U'";
        }
    }
     function getEffectiveTime(solve) {
            if (!solve) return Infinity;
            if (solve.penalty === "DNF") return Infinity;
            if (solve.penalty === "+2") return solve.time + 2000;
            return solve.time;
    }
     function calculateWindowAoN(window,n){
                const dnfCount = window.filter(x => x === Infinity).length;
                if(dnfCount>=2)return Infinity;
                const sorted = [...window].sort((a, b) => a - b);
                const trimmed = sorted.slice(1, n - 1);
                const sum = trimmed.reduce((acc, t) => acc + t, 0);
                const avg = sum / (n - 2);

                return avg;
        };
    function calculateStats(solves){
        const stats={
                solveCount:0,
                validCount:0,

                bestSingle:null,
                worstSingle:null,

                mean:null,
                median:0,
                stdDev:0,

                ao5:null,
                ao12:null,
                ao100:null,

                bestAo5:null,
                bestAo12:null,
                bestAo100:null,

                totalPracticeTime:0,
                successRate:0,

                stability:0,
                improvementVelocity:null,
                currentStreak:0,
                longestStreak:0,
                pbProbability:null,
                bellCurve:null,
                subXSuccess:null
            
        };
        if(solves.length===0)return stats;
    
        
        const effectiveTimes=[];
        solves.forEach((solve)=>{
            const effectiveTime=getEffectiveTime(solve);
            effectiveTimes.push(effectiveTime);
            stats.solveCount++;
            if(Number.isFinite(effectiveTime)){
                stats.validCount++;
                stats.totalPracticeTime+=effectiveTime;

                if(stats.bestSingle == null){
                    stats.bestSingle = effectiveTime;
                    stats.worstSingle = effectiveTime;
                }else{
                    if(effectiveTime<stats.bestSingle){
                    stats.bestSingle=effectiveTime;
                    }
                    if(effectiveTime>stats.worstSingle){
                        stats.worstSingle=effectiveTime;
                    }
                }  
            }
        })
        if(stats.validCount>0){
            stats.mean=stats.totalPracticeTime/stats.validCount;
        };
        function calculateCurrentAoN(effectiveTimes, n) {
            if (effectiveTimes.length < n) return null;
            const times = effectiveTimes.slice(-n);
            const dnfCount = times.filter(x => x === Infinity).length;
            if(dnfCount>=2)return Infinity;
            const sorted = [...times].sort((a, b) => a - b);
            const trimmed = sorted.slice(1, n - 1);
            const sum = trimmed.reduce((acc, t) => acc + t, 0);
            const avg = sum / (n - 2);

            return avg;
        }
        stats.ao5=calculateCurrentAoN(effectiveTimes, 5);
        stats.ao12=calculateCurrentAoN(effectiveTimes, 12);
        stats.ao100=calculateCurrentAoN(effectiveTimes, 100);
       
        function calculateBestAoN(effectiveTimes,n){
            if(effectiveTimes.length<n)return null;
            let best_aoN=Infinity;
            for(let i=0;i<=effectiveTimes.length-n;i++){
                let window=effectiveTimes.slice(i,n+i);
                const aoN=calculateWindowAoN(window,n);
                    if(best_aoN>aoN){
                        best_aoN=aoN;
                    }
            }
            return best_aoN===Infinity?null:best_aoN;
        }
        stats.ao5 = calculateCurrentAoN(effectiveTimes, 5);
        stats.ao12 = calculateCurrentAoN(effectiveTimes, 12);
        stats.ao100 = calculateCurrentAoN(effectiveTimes, 100);

        stats.bestAo5 = calculateBestAoN(effectiveTimes, 5);
        stats.bestAo12 = calculateBestAoN(effectiveTimes, 12);
        stats.bestAo100 = calculateBestAoN(effectiveTimes, 100);

        stats.successRate=stats.validCount*100/stats.solveCount;

        function calculateStdDev(effectiveTimes){
            const valid=effectiveTimes.filter(Number.isFinite);
            if(valid.length===0)return null;
            const mean = valid.reduce((a,b)=>a+b,0)/valid.length;

            const variance=valid.reduce((sum,t)=>{
                return sum+(t-mean)*(t-mean);
            },0)/valid.length;
            return Math.sqrt(variance);
        }
        stats.stdDev=calculateStdDev(effectiveTimes);

        function calculateMedian(effectiveTimes){
            const valid=effectiveTimes.filter(Number.isFinite).sort((a,b)=>a-b);
            if(valid.length===0)return null;
            const mid=Math.floor(valid.length/2);
            if(valid.length%2==0){
                return (valid[mid-1]+valid[mid])/2;
            }
            return valid[mid];
        }
        stats.median=calculateMedian(effectiveTimes)

        stats.stability=stabilityScore(stats.mean,stats.stdDev);
        stats.improvementVelocity=improvementVelocity(solves);

        let heatmapData=getHeatmapData(solves);
        let map=makeHeatmapLookup(heatmapData);
        stats.currentStreak=getCurrentStreak(map);
        stats.longestStreak=getLongestStreak(map);
        stats.pbProbability=getPBProbability(stats.bestSingle,stats.mean,stats.stdDev);
        stats.bellCurve=generateBellCurve(stats.mean,stats.stdDev);
        stats.subXSuccess=getSubXSuccessRate(effectiveTimes,10000);
        return stats;
    }

    function getProgressData(effectiveTimes,n){
        if(effectiveTimes.length<n)return null;
        let data=[];
        for(let i=0;i<=effectiveTimes.length-n;i++){
            let window=effectiveTimes.slice(i,i+n);
            const aoN=calculateWindowAoN(window, n);
            data.push({
                x:i+n,
                y: aoN === Infinity ? null : aoN,
            });
         }
        return data
    }
    function getPBData(effectiveTimes){
       if(effectiveTimes.length<1)return null;
       let data=[];
       let PB=Infinity;
       effectiveTimes.forEach((lastSolve,index)=>{
            if(PB>lastSolve){
                PB=lastSolve;
                data.push({
                    x:index+1,
                    y:PB,
                })
            }
       })
       return data;
    }
    
    function getSolveDistribution(effectiveTimes){
        let valid=effectiveTimes.filter(x=>x!=null && x!=Infinity);
        if(valid.length===0)return null;
        valid=valid.map(x=>x/1000);
        let min=Math.min(...valid);
        let max=Math.max(...valid);
        let mean=valid.reduce((a,b)=>a+b,0)/valid.length;
        let bucketSize=1;
        if(mean<10){
            bucketSize=.25;
        }else if(10<=mean && mean<20){
            bucketSize=0.5;
        }
        min=Math.floor(min/bucketSize)*bucketSize;
        max=Math.ceil(max/bucketSize)*bucketSize;
        let buckets=[];
        let start=min
        for(let i=0;i<=(max-min)/bucketSize;i++){
            buckets.push({
                start:start,
                end:start+bucketSize,
                count:0,
            });
            start+=bucketSize;
        };
        valid.forEach(time=>{
            let index=Math.floor((time-min)/bucketSize);
            if(index===buckets.length){
                index--;
            }
            buckets[index].count++;
        });

        return buckets.map(bucket => ({
            x: `${bucket.start}-${bucket.end}`,
            y: bucket.count
        }));
    }

    function getHeatmapData(solves){
        let data=[];
        let counts={};
        solves.forEach(solve=>{
            let d=new Date(solve.id);

            let date=d.getFullYear()+"-"+String(d.getMonth() + 1).padStart(2, "0") + "-" +
                 String(d.getDate()).padStart(2, "0");

            if(!(date in counts)){
                counts[date]=1;
            }else{
                counts[date]++;
            }
        })
        for (let [key, value] of Object.entries(counts)) {
            data.push({
                date:key,
                count:value,
            })
        }

      
        return data
    }
    
         
          function getMaxCount(data){
            let max=0;
            data.forEach(day=>{
                if(day.count>max){
                    max=day.count;
                }
            });
            return max;
        }
       

        function getLevel(count,max){
            if(count===0)return 0;
            let level=Math.ceil((count/max)*5);
            return Math.min(level,5);
        }

        function getColor(level) {
            const colors = [
                "#171C32",
                "#25154B",
                "#43208C",
                "#6A2CF5",
                "#8E42FF",
                "#B15CFF"
            ];
            return colors[level];
        }

        function getHeatColor(count,max){
            let level=getLevel(count,max);
            return getColor(level);
        }

        function makeHeatmapLookup(data){
            let map={};
            data.forEach(day=>{
                map[day.date]=day.count;
            })
            return map;
        }
    function renderMonth(year,month,map,max,container){
            
                let firstDay=new Date(year,month,1);
                let offset = (firstDay.getDay() - 1 + 7) % 7;
               
                let lastDay=new Date(year,month+1,0);
                
                let monthDiv = document.createElement("div");
                monthDiv.className = "month-block";
                
                let monthSidebar = document.createElement("div");
                monthSidebar.className = "month-sidebar";

                let topDot = document.createElement("div");
                topDot.className = "month-dot";

                let topLine = document.createElement("div");
                topLine.className = "month-line";

                let label = document.createElement("div");
                label.className = "month-label";
                label.textContent = new Date(year, month)
                    .toLocaleString("default", { month: "short" })
                    .toUpperCase();

                let bottomLine = document.createElement("div");
                bottomLine.className = "month-line";

                let bottomDot = document.createElement("div");
                bottomDot.className = "month-dot";
                monthSidebar.appendChild(topDot);
                monthSidebar.appendChild(topLine);
                monthSidebar.appendChild(label);
                monthSidebar.appendChild(bottomLine);
                monthSidebar.appendChild(bottomDot);
                let grid = document.createElement("div");
                grid.className = "month-grid";
                
                monthDiv.appendChild(monthSidebar);
                monthDiv.appendChild(grid);
                container.appendChild(monthDiv);

                 for(let i=0;i<offset;i++){
                    let cell=document.createElement("div");
                    cell.className="heat-cell";
                    grid.appendChild(cell);
                }
                

                for(let day=1;day<=lastDay.getDate();day++){
                     let current=new Date(year,month,day);
                    let date=current.getFullYear()+"-"+String(current.getMonth()+1).padStart(2,"0")+"-"+String(current.getDate()).padStart(2,"0"); 
                    let count = map[date] || 0;
                   
                    let cell=document.createElement("div");
                    cell.className="heat-cell";
                    cell.style.background = getHeatColor(count, max);
                    if(count>0){
                        cell.classList.add("active");
                    }
                    grid.appendChild(cell);
                    
                }

                let total = offset + lastDay.getDate();
                let trailing = (7 - (total % 7)) % 7;
                for(let i = 0; i < trailing; i++){
                    let cell = document.createElement("div");
                    cell.className = "heat-cell";
                    grid.appendChild(cell);
                }
        }
        function getCurrentStreak(map){
            let streak=0;
            let d=new Date();
            while(true){
                let date=
                d.getFullYear()+"-"+
                String(d.getMonth()+1).padStart(2,"0")+"-"+
                String(d.getDate()).padStart(2,"0");
                if(map[date]){
                    streak++;
                    d.setDate(d.getDate()-1);
                }
                else{
                    break;
                }
            }
            return streak;
        }
        function renderHeatmap(solves){
            let data = getHeatmapData(solves);
            let practiceDays = data.length;
            document.getElementById("practiceDays").textContent = practiceDays;
                let max = getMaxCount(data);
                let map = makeHeatmapLookup(data);
            document.getElementById("currentStreak").textContent =
            getCurrentStreak(map);

                 let container=document.getElementById("heatmapGrid");
                container.innerHTML="";
            let today = new Date();

            let year = today.getFullYear();
            let month = today.getMonth();

            renderMonth(year, month-2, map, max,container);
            renderMonth(year, month-1, map, max,container);
            renderMonth(year, month, map, max,container);
            
        }

      

        function stabilityScore(mean,stdDev){
            if(mean==null || stdDev==null)return null;
            let cv=stdDev/mean;
            let score=100-cv*100;
            return Math.max(0,Math.min(100,score));
        }
        
        function improvementVelocity(solves){
            let effectiveTimes=[];
             solves.forEach((solve)=>{
            const effectiveTime=getEffectiveTime(solve);
            effectiveTimes.push(effectiveTime);
             })

            
             let valid=effectiveTimes.filter(Number.isFinite);
              if(valid.length<40)return null;
             let first20=valid.slice(-40,-20);
             let last20=valid.slice(-20);
             let first20_avg=first20.reduce((a,b)=>a+b,0)/first20.length;
             let last20_avg=last20.reduce((a,b)=>a+b,0)/last20.length;
             return first20_avg-last20_avg;
        }
        function getLongestStreak(map){
            let dates=Object.keys(map);
            if(dates.length===0)return 0;
            dates.sort();
            let currentStreak=1;
            let longestStreak=1;
            for(let i=1;i<dates.length;i++){
                let current=new Date(dates[i]);
                let previous=new Date(dates[i-1]);
                let diff=(current-previous)/(1000*60*60*24);
                if(diff===1){
                    currentStreak++;
                }else{
                    currentStreak=1;
                }
                longestStreak = Math.max(longestStreak, currentStreak);
            }
            return longestStreak;
        }
        function getSubXSuccessRate(effectiveTimes,target){
            let valid=effectiveTimes.filter(Number.isFinite);
            if(valid.length === 0) return null;
            let subTarget=0;
            for(let i=0;i<valid.length;i++){
                if(valid[i]<=target){
                    subTarget++;
                }
            }
            return (subTarget/valid.length)*100;
        }

        function getPBProbability(bestSingle,mean,stdDev){
            if(bestSingle==null||mean==null||stdDev==null){
                return null;
            }
            if(stdDev==0){
                return 100;
            }
            return jStat.normal.cdf(bestSingle,mean,stdDev)*100;
        }
        function generateBellCurve(mean,stdDev){
              if(mean==null || stdDev==null)return[];
            mean/=1000;
            stdDev/=1000;
          
            if(stdDev ===0)return [];
            let data=[];
            let start=mean-4*stdDev;
            let end=mean+4*stdDev;
            let points=100;
            let step=(end-start)/points;
            for(let i=0;i<=points;i++){
                let x=start+i*step;
                data.push({
                    x:x,
                    y:jStat.normal.pdf(x,mean,stdDev)
                })
            }
            return data;
        }
    // ============================================================
    // 4. Local storage
    // ============================================================
    function saveData() {
        const data = {
            activeSessionId,
            sessions: allSessions,
        };
        localStorage.setItem("cubolioData", JSON.stringify(data));
    }

    function loadData() {
        const saved = localStorage.getItem("cubolioData");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                activeSessionId = parsed.activeSessionId;
                allSessions = parsed.sessions || [];
                const active = allSessions.find(s => s.id === activeSessionId);
                sessionSolves = active ? active.solves : [];
                if (!active && allSessions.length) {
                    // fallback to first session
                    activeSessionId = allSessions[0].id;
                    sessionSolves = allSessions[0].solves;
                }
                if (!allSessions.length) createDefaultSession();
            } catch (e) {
                createDefaultSession();
            }
        } else {
            createDefaultSession();
        }
        refreshDashboard();
        renderSessionMenu();
        if (scrambleText && scrambleText.innerText === "Loading...") generateScramble();
    }

    function createDefaultSession() {
        const newSession = {
            id: Date.now().toString(),
            name: "Session 1",
            solves: []
        };
        allSessions = [newSession];
        activeSessionId = newSession.id;
        sessionSolves = newSession.solves;
        saveData();
    }

    // ============================================================
    // 5. Formatting / Helpers
    // ============================================================
    function formatTime(rawMs) {
        if (rawMs === Infinity || rawMs === undefined || rawMs === null) return "--";
        const min = Math.floor(rawMs / 60000);
        const sec = Math.floor((rawMs / 1000) % 60);
        const centi = Math.floor((rawMs % 1000) / 10);
        if (min === 0) {
            return `${sec}.${String(centi).padStart(2, "0")}`;
        }
        return `${min}:${String(sec).padStart(2, "0")}.${String(centi).padStart(2, "0")}`;
    }

    function calcAoN(solves, n) {
        if (solves.length < n) return "--";
        const times = solves.slice(0, n).map(s => getEffectiveTime(s));
        const sorted = [...times].sort((a, b) => a - b);
        const trimmed = sorted.slice(1, n - 1);
        const sum = trimmed.reduce((acc, t) => acc + t, 0);
        const avg = sum / (n - 2);
        if (avg === Infinity || isNaN(avg)) return "DNF";
        return formatTime(avg);
    }

    const calculateAo5 = (solves) => calcAoN(solves, 5);
    const calculateAo12 = (solves) => calcAoN(solves, 12);

    // ============================================================
    // 6. UI Updates
    // ============================================================
    function refreshDashboard() {
        // main stats
        if (solvesTodayDisplay) solvesTodayDisplay.innerText = sessionSolves.length;
        if (ao5Display) ao5Display.innerText = calculateAo5(sessionSolves);
        if (ao12Display) ao12Display.innerText = calculateAo12(sessionSolves);

        // session panel
        updateSessionStats();
        updateHistoryUI();
        updateCharts();  
         renderHeatmap(sessionSolves); 
    }

    function updateSessionStats() {
        const active = allSessions.find(s => s.id === activeSessionId);
        if (!active) return;
        const solves = active.solves;
        if (solves.length > 0) {
            if (sessionSolvesCount) sessionSolvesCount.innerText = solves.length;
            const total = solves.reduce((a, b) => a + b.time, 0);
            if (sessionMean) sessionMean.innerText = formatTime(total / solves.length);
            const best = Math.min(...solves.map(s => s.time));
            if (sessionBest) sessionBest.innerText = formatTime(best);
            if (sessionAo5) sessionAo5.innerText = calculateAo5(solves);
            if (sessionAo12)sessionAo12.innerText = calculateAo12(solves);
        } else {
            if (sessionSolvesCount) sessionSolvesCount.innerText = "0";
            if (sessionMean) sessionMean.innerText = "--";
            if (sessionBest) sessionBest.innerText = "--";
            if (sessionAo5) sessionAo5.innerText = "--";
            if (sessionAo12)sessionAo12.innerText = "--";
        }
    }

    function updateHistoryUI() {
    const tbody = document.querySelector("#history-list");
    if (!tbody) return;

    tbody.innerHTML = "";

    sessionSolves.slice(0,5).forEach((solve, index) => {

        const tr = document.createElement("tr");

        // Time
        let timeText;
        if (solve.penalty === "DNF") {
            timeText = "DNF";
        } else if (solve.penalty === "+2") {
            timeText = formatTime(solve.time + 2000) + "+";
        } else {
            timeText = formatTime(solve.time);
        }

        // Ao5
        const ao5 =
            sessionSolves.length >= index + 5
                ? calculateAo5(sessionSolves.slice(index))
                : "--";

        // Ao12
        const ao12 =
            sessionSolves.length >= index + 12
                ? calculateAo12(sessionSolves.slice(index))
                : "--";

        // Penalty
        const penalty = solve.penalty || "-";

        // Time Ago
        const diff = Math.floor((Date.now() - solve.id) / 1000);

        let ago;

        if (diff < 60)
            ago = diff + "s ago";
        else if (diff < 3600)
            ago = Math.floor(diff / 60) + "m ago";
        else
            ago = Math.floor(diff / 3600) + "h ago";

        let delta = "--";
        let deltaClass = "";
        const current=getEffectiveTime(solve);

        if (index < solves.length - 1) {
            let previous = getEffectiveTime(solves[index + 1]);

            if (Number.isFinite(current) && Number.isFinite(previous)) {
                const deltaValue = (current - previous) / 1000;

                delta =
                    (deltaValue> 0 ? "+" : "") +
                    deltaValue.toFixed(2);
                deltaClass = deltaValue < 0 ? "better" : "worse";
            }
        }
    
        
        tr.innerHTML = `
            <td class="solve-time">${timeText}</td>
            <td>${ao5}</td>
            <td class="${deltaClass}">${delta}</td>
            <td>${ao12}</td>
            <td>${penalty}</td>
            <td>${ago}</td>
        `;

        // Click time -> toggle penalty
        tr.children[0].style.cursor = "pointer";
        tr.children[0].onclick = () => togglePenalty(solve.id);

        // Double click row -> delete solve
        tr.ondblclick = () => deleteSolve(solve.id);

        tbody.appendChild(tr);
    });
}

    function renderSessionMenu(){
    const menu=document.getElementById("session-menu");
    const input=document.getElementById("session-name-input");
    menu.innerHTML="";
    allSessions.forEach(session=>{
        const div=document.createElement("div");
        div.className="session-option";
        if(session.id===activeSessionId)
            div.classList.add("active");
        div.textContent=session.name;
        div.onclick=()=>{
            activeSessionId=session.id;
            sessionSolves=session.solves;
            input.value=session.name;
            saveData();
            refreshDashboard();
            renderSessionMenu();
            menu.classList.remove("open");
            document.querySelector(".session-arrow").classList.remove("rotate");
        };
        menu.appendChild(div);
    });
    const add=document.createElement("div");
    add.className="session-option session-new";
    add.textContent="+ New Session";
    add.onclick=()=>{
        document.getElementById("btn-new-session").click();
    };
    menu.appendChild(add);
    const active=allSessions.find(s=>s.id===activeSessionId);
    if(active)
        input.value=active.name;
}

    function updateTimerUI(rawMs) {
        const time = rawMs || 0;
        const min = Math.floor(time / 60000);
        const sec = Math.floor((time / 1000) % 60);
        const centi = Math.floor((time % 1000) / 10);

        let secDisplay = (min > 0) ? `${min}:${String(sec).padStart(2, "0")}` : String(sec);

        if (secPart) secPart.innerText = secDisplay;
        if (centiPart) centiPart.innerText = String(centi).padStart(2, "0");

        // hide centi during inspection / ready
        if (timerState === "inspecting" || timerState === "ready") {
            if (dotPart) dotPart.style.display = "none";
            if (centiPart) centiPart.style.display = "none";
        } else {
            if (dotPart) dotPart.style.display = "inline";
            if (centiPart) centiPart.style.display = "inline";
        }
    }

    // ============================================================
    // 7. Actions: delete, penalty, session management
    // ============================================================
    function deleteSolve(id) {
        sessionSolves = sessionSolves.filter(s => s.id !== id);
        const active = allSessions.find(s => s.id === activeSessionId);
        if (active) active.solves = sessionSolves;
        saveData();
        refreshDashboard();
    }

    function togglePenalty(id) {
        const solve = sessionSolves.find(s => s.id === id);
        if (!solve) return;
        if (solve.penalty === null) solve.penalty = "+2";
        else if (solve.penalty === "+2") solve.penalty = "DNF";
        else if (solve.penalty === "DNF") solve.penalty = null;
        const active = allSessions.find(s => s.id === activeSessionId);
        if (active) active.solves = sessionSolves;
        saveData();
        refreshDashboard();
    }

    // ============================================================
    // 8. Timer Logic (keyboard)
    // ============================================================
let isFocusMode=false;    
const focusBtn = document.querySelector("#focusbtn");

function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    document.body.classList.toggle("focus-mode", isFocusMode);
}
  
focusBtn.addEventListener("click", toggleFocusMode);   
document.addEventListener("keydown", function(e) {
    if (e.code === "KeyF") {
        toggleFocusMode();
    }
}); 

    document.addEventListener("keydown", function (e) {
        if (e.target.tagName === "INPUT") return;
        if (e.code === "Space") {
            e.preventDefault();
            if (timerState === "inspecting") {
                timerState = "ready";
                if (timerEl) timerEl.className = "timer-time state-ready";
                if(!isFocusMode){
                    document.body.classList.add('focus-mode');
                } 
            }
        }
    });
    // ... your other code ...

// SCROLLING FIX: Prevent spacebar from scrolling
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && e.target.tagName !== "INPUT") {
        e.preventDefault(); // This stops the page from scrolling
    }
}); 

// // Timer logic on keyup (when you release the spacebar)
// document.addEventListener("keyup", function(event) {
//     if (event.target.tagName === "INPUT") return;
//     if (event.code !== "Space") return;
    
//     // Your timer logic here...
//     if (timerState === "idle") {
//         // Start inspection...
//     } else if (timerState === "ready") {
//         // Start running...
//     } else if (timerState === "running") {
//         // Stop running...
//     }
// });

// ... rest of your code ...
    document.addEventListener("keyup", function (e) {
        if (e.target.tagName === "INPUT") return;
        if (e.code === "Space") {
            e.preventDefault();

            // --- IDLE -> INSPECTION ---
            if (timerState === "idle") {
                timerState = "inspecting";
                inspectionTime = 0;
                timerEl.className = "timer-time state-inspecting";
                if(!isFocusMode)document.body.classList.add('focus-mode');
                updateTimerUI(0);

                // start inspection countdown (15s)
                if (inspectionIntervalId) clearInterval(inspectionIntervalId);
                inspectionIntervalId = setInterval(() => {
                    inspectionTime++;
                    if (inspectionTime > 15) {
                        clearInterval(inspectionIntervalId);
                        inspectionIntervalId = null;
                        // show DNF on timer
                        if (secPart) secPart.innerText = "DNF";
                        if (centiPart) centiPart.innerText = "";
                        if (dotPart) dotPart.style.display = "none";
                        timerEl.className = "timer-time state-dnf";
                                const newSolve = {
                                    id: Date.now(),
                                    time: 0,
                                    penalty: "DNF",
                                };
                                sessionSolves.unshift(newSolve);
                                saveData();
                                refreshDashboard();
                                timerState="idle";
                                timerEl.className = "timer-time ";
                        // reset state after a moment? keep as inspecting but show DNF
                    } else {
                        updateTimerUI(inspectionTime * 1000);
                    }
                }, 1000);
                return;
            }

            // --- READY -> RUNNING ---
            if (timerState === "ready") {
                timerState = "running";
                timerEl.className = "timer-time";
                // stop inspection
                if (inspectionIntervalId) {
                    clearInterval(inspectionIntervalId);
                    inspectionIntervalId = null;
                }
                inspectionTime = 0;
                start = Date.now();
                if (intervalId) clearInterval(intervalId);
                intervalId = setInterval(() => {
                    const now = Date.now();
                    elapsedTime = now - start;
                    updateTimerUI(elapsedTime);
                }, 33);
                return;
            }

            // --- RUNNING -> STOP (save solve) ---
            if (timerState === "running") {
                clearInterval(intervalId);
                intervalId = null;
                timerState = "idle";
                document.body.classList.toggle("focus-mode", isFocusMode);
                timerEl.className = "timer-time";

                // save solve
                if (elapsedTime > 0) {
                    const newSolve = {
                        id: Date.now(),
                        time: elapsedTime,
                        penalty: null,
                    };
                    sessionSolves.unshift(newSolve);
                    const active = allSessions.find(s => s.id === activeSessionId);
                    if (active) active.solves = sessionSolves;
                    saveData();
                    refreshDashboard();
                    generateScramble();
                }
                generateScramble();
                return;
            }

            // if inspecting and space was pressed, already handled in keydown -> ready
        }
    });

    // ============================================================
    // 9. Session controls (new, rename, switch)
    // ============================================================
    document.addEventListener("DOMContentLoaded", function () {
        // New session button
        const newBtn = document.querySelector("#btn-new-session");
        if (newBtn) {
            newBtn.addEventListener("click", function () {
                const newSession = {
                    id: Date.now().toString(),
                    name: `Session ${allSessions.length + 1}`,
                    solves: [],
                };
                allSessions.push(newSession);
                activeSessionId = newSession.id;
                sessionSolves = newSession.solves;
                saveData();
                refreshDashboard();
                renderSessionMenu();
                generateScramble();
            });
        }

        // Rename session
        const nameInput = document.querySelector("#session-name-input");
        if (nameInput) {
            nameInput.addEventListener("change", function () {
                const active = allSessions.find(s => s.id === activeSessionId);
                if (active) {
                    active.name = this.value || "Unnamed";
                    saveData();
                    renderSessionMenu();
                }
            });
        }


        // Load data and init
        loadData();
        // Generate scramble on load
        generateScramble();
        // extra: if scramble text still "Loading..." generate again
        setTimeout(() => {
            if (scrambleText && scrambleText.innerText === "Loading...") generateScramble();
        }, 500);

        // Update the "solves" count in session panel on any change
        refreshDashboard();
    });

    // ============================================================
    // 10. Additional: expose generateScramble to any button if needed
    // ============================================================
    // "Copy Scramble" / "Generate Scramble" quick actions
    document.addEventListener("click", function (e) {
        if (e.target && e.target.innerText === "Generate Scramble") {
            generateScramble();
        }
        if (e.target && e.target.innerText === "Copy Scramble") {
            if (scrambleText) {
                navigator.clipboard?.writeText(scrambleText.innerText).catch(() => {});
            }
        }
    });

    console.log("✅ Speedcubing Dashboard JS loaded (with timer, localStorage, stats)");
const menu=document.getElementById("session-menu");
const arrow=document.querySelector(".session-arrow");
document
.getElementById("session-dropdown-btn")
.onclick=(e)=>{
    e.stopPropagation();
    menu.classList.toggle("open");
    arrow.classList.toggle("rotate");
};

document.addEventListener("click",()=>{
    menu.classList.remove("open");
    arrow.classList.remove("rotate");

});

// keybord Shortcut
document.addEventListener("keydown",function(e){
    if(e.code==="KeyF"){
        document.body.classList.toggle("focus-mode");
    }
})


// NEW FEATURES IMPORT EXPORT
// exportBtn.addEventListener("click", () => {
//     const data = JSON.stringify(allSessions, null, 2);
//     const blob = new Blob([data], {
//         type: "application/json"
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "cubolio-data.json";
//     a.click();
//     URL.revokeObjectURL(url);
// });

// const fileInput = document.createElement("input");
// fileInput.type = "file";
// fileInput.accept = ".json";
// importBtn.addEventListener("click", () => {
//     fileInput.click();
// });
// fileInput.addEventListener("change", e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = function () {
//         try {
//             allSessions = JSON.parse(reader.result);
//             saveData();
//             loadData();
//             refreshDashboard();
//         }
//         catch {
//             alert("Invalid Cubolio backup.");
//         }
//     };
//     reader.readAsText(file);
// });