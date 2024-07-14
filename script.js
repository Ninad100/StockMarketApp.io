

const asideSectionDiv = document.getElementById('aside-data');
const chartDisplayEle = document.getElementById('chart-elemet');
const descDiv = document.getElementById('description-div');
const minValueChart = document.getElementById('min-value-chart');
const maxValueChart = document.getElementById('max-value-chart')


let currObj;
let timeRangeSelected;
let currName;

let stocks = [];

//Function to get all the details from API
async function getDetails(){
    const response1 = await fetch("https://stocks3.onrender.com/api/stocks/getstocksdata");
    const data1 = await response1.json();
    const response2 = await fetch("https://stocks3.onrender.com/api/stocks/getstocksprofiledata");
    const data2 = await response2.json();
    const response3 = await fetch("https://stocks3.onrender.com/api/stocks/getstockstatsdata");
    const data3 = await response3.json();

    console.log(data1);
    console.log(data2);
    console.log(data3);
    //currObj = data1.stocksData[0]['AAPL'];
    currObj = data1;
    currName = 'AAPL';
    timeRangeSelected = '1mo';
    displayChart(currObj,'AAPL');
    console.log(currObj)
    

    //stocks = data3.stocksStatsData[0].keys();
    stocks = Object.keys(data3.stocksStatsData[0])
    console.log(stocks)
    asideSectionHTML(data3,data1,data2);
    displayDescription('AAPL',data2,data3);


}

getDetails();


//Event listener to get details based on time duration
$('#1month').click(function(){
    timeRangeSelected = '1mo';
    displayChart(currObj,currName);

});

$('#3month').click(function(){
    console.log('inside 3mo')
    timeRangeSelected = '3mo';
    displayChart(currObj,currName);

});

$('#year').click(function(){
    console.log('inside 3mo')
    timeRangeSelected = '1y';
    displayChart(currObj,currName);

});

$('#5year').click(function(){
    console.log('inside 3mo')
    timeRangeSelected = '5y';
    displayChart(currObj,currName);

});

//Function to display aside section for all stocks
function asideSectionHTML(obj,chartObj,descObj){

    stocks.forEach((ele,idx)=>{
        if (idx < stocks.length -1){
        const asideStockSingleDiv = document.createElement('div');
        asideStockSingleDiv.className = 'individual-aside-div';

        const btn = document.createElement('button');
        btn.textContent = ele;
        const bookValue = document.createElement('span');
        //console.log(ele)
        //console.log(obj.stocksStatsData[0]['AAPL']['bookValue'])
        bookValue.textContent = '$' + obj.stocksStatsData[0][ele]['bookValue'];
        bookValue.style.color = 'white';
        //const dollarSymbol = `<i class="fa-solid fa-dollar-sign" style="color: #fcfcfd;"></i>`;
        //bookValue.innerHTML = dollarSymbol

        const profit = document.createElement('span');
        profit.textContent =  Math.round((obj.stocksStatsData[0][ele]['profit']) * 100) /100 + '%';;

        if(obj.stocksStatsData[0][ele]['profit'] == 0){
            profit.style.color = 'red'
        }else{
            profit.style.color = '#17fc03';
        }

        asideStockSingleDiv.style.marginTop = '5%';

        asideStockSingleDiv.appendChild(btn);
        asideStockSingleDiv.appendChild(bookValue);
        asideStockSingleDiv.appendChild(profit);
        asideSectionDiv.appendChild(asideStockSingleDiv);

        btn.addEventListener('click',()=>{

            btnname = btn.textContent;
            currName = btnname;
            currObj = chartObj;
            displayChart(chartObj,btnname);
            displayDescription(ele,descObj,obj);
        })
        }
        
        
    })
}


//Function to display plot using Plotlyjs
function displayChart(obj,name){
    
    console.log('name', name)
    console.log(timeRangeSelected);
    console.log(obj)
    //const xArray = obj.stocksData[0]['AAPL']['1mo']['timeStamp'];
    let xArray = obj.stocksData[0][name][timeRangeSelected]['timeStamp'];
    //console.log(xArray)
    let yArray = obj.stocksData[0][name][timeRangeSelected]['value'];
    console.log('max;',Math.max(...yArray))
    minValueChart.textContent = 'Min Value: ' + (Math.min(...yArray)).toFixed(2);
    maxValueChart.textContent ='Max Value: ' + Math.max(...yArray).toFixed(2);
    //console.log(yArray)
    let xArray1 = [];
    xArray.forEach((ele)=>{
        ele =  new Date(ele*1000).toLocaleDateString();
        xArray1.push(ele);
    })
    console.log('xArray')
    console.log(xArray1)

    const data = [{
        x: xArray1,
        y: yArray,
        mode: "lines",
        type: "scatter",
        line: {
            color: '#17fc03',
            size: 8
        }
      }];
      
      // Define Layout
      const layout = {
        //xaxis: {range: xArray1, type: 'date' ,title: "Square Meters"},
        //yaxis: {range: yArray, title: "Price in Millions"},
        //title: "House Prices vs Size"
        xaxis: {
            tickfont: {
                color : 'white' //Coloring of x axis coordinates
            }
        },
        yaxis: {
            tickfont: {
                color : 'white' //Coloring of x axis coordinates
            }
        }
      };
      console.log('lay')
      console.log(layout)
      
      //layout['plot_bgcolor'] = 'rgb(21, 21, 88)';
      layout['plot_bgcolor'] = 'rgb(16, 16, 97)';
      layout['paper_bgcolor'] = 'rgb(4, 4, 53)';

      
      
    // Display using Plotly
    Plotly.newPlot("chart-elemet",data,layout);
}


//Function to display description of selected stock
function displayDescription(ele,descObj,obj){
    descDiv.textContent = '';
    const descSectionDiv = document.createElement('div');
    //descSectionDiv.className = 'individual-aside-div';

        const btn = document.createElement('h4');
        btn.textContent = ele;
        btn.style.color = 'white';
        btn.style.display = 'inline-block';
        const bookValue = document.createElement('span');
        //console.log(ele)
        //console.log(obj.stocksStatsData[0]['AAPL']['bookValue'])
        bookValue.textContent = '$'+ obj.stocksStatsData[0][ele]['bookValue'];
        bookValue.style.marginLeft = '3%';
        bookValue.style.color = 'white';
        bookValue.style.fontSize = 'larger';
        bookValue.style.fontWeight = '700';

        const profit = document.createElement('span');
        //const profitValue = Math.round((obj.stocksStatsData[0][ele]['profit']) * 100) /100;
        profit.textContent = Math.round((obj.stocksStatsData[0][ele]['profit']) * 100) /100 + '%';
        //profit.textContent = profitValue;
        profit.style.marginLeft = '3%';
        profit.style.fontSize = 'larger';
        profit.style.fontWeight = '700';

        if(obj.stocksStatsData[0][ele]['profit'] <= 0){
            profit.style.color = 'red';
        }else{
            profit.style.color = '#17fc03';
        }

        descDiv.appendChild(btn);
        descDiv.appendChild(bookValue);
        descDiv.appendChild(profit);
        descDiv.appendChild(descSectionDiv);

        const descriptionStock = document.createElement('p');
        descriptionStock.textContent = descObj.stocksProfileData[0][ele]['summary'];
        descriptionStock.style.color = 'white';
        descDiv.appendChild(descriptionStock);
}