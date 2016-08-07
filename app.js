//parent and current node array for all data
//var jsonData = []; 
var currentDataNode = [];
var chartObj = [];
var pathObj = [];
var isTouchSupported;
//Breadcrumbs trail sequence variable
var current_breadcrumbs;
var dataSet = '';
var sampleName = '';
var refArea;


function init(){
    
    isTouchSupported = isMobileDevice();
    
    var configFile;
    
    //loadataConfig function : Returns response object which is json config 
    loadataConfig( function(response){
    
        configFile = JSON.parse(response);
    });

    // temporary variable to store metadata info
    var tmp_data = [];
    var tmp_sampleName = [];
    
    // Reading config file and storing file path and name as tmp_data.
    // Storing name of sample in array (tmp_samplename) 
    for(var i =0; i < configFile.metadata.length; i++){
       
        tmp_data.push(configFile.metadata[i].path + configFile.metadata[i].filename);
        tmp_sampleName.push(configFile.metadata[i].id);
    };
    
    // Assinging loacal arrays to global variables
    dataSet = tmp_data;
    sampleName = tmp_sampleName;
    refArea = tmp_sampleName;
    
    //Creating ref area dynamically using refarea names
    createChartDiv(sampleName);

    //Adding charts on created div elements
    createChartOnDiv(sampleName, dataSet);
    
} //end of init()

/**
 * Function to dynamically create bootstrap grids
 * @param { array } nameArray - Name of charts div
*/
function createChartDiv(nameArray){

    for(i in nameArray){
    
        var colDiv = document.createElement('div'),
            cardDiv = document.createElement('div'),
            cardTitleDiv = document.createElement('div'), 
            chartDiv= document.createElement('div');
            
            colDiv.className = 'col-md-4 col-sm-6  col-xs-12';
            cardDiv.className = 'card card-block';
            cardTitleDiv.className = 'card card-title dropdown';
        
            //Adding save button to card title
            var saveButtonId = "save" + sampleName[parseInt(i)];
            var inputId = "input" + sampleName[parseInt(i)];
            
            if(parseInt(i) == 0){
                
                colDiv.id = "step2";
                cardTitleDiv.innerHTML += '<button id="'+ saveButtonId +'" type="btn btn-raised" value="'+ sampleName[parseInt(i)] +'" class="btn btn-default btn-raised btn-responsive">save <sapn class="icon-download icon-large"></sapn></button>';
                 cardTitleDiv.innerHTML += ' <input id="' + inputId+'"  class="btn btn-raised btn-input input-responsive" \
                    type="text" placeholder="sample' + (parseInt(i) + 1) +'">';
                
            }else{
                cardTitleDiv.innerHTML += '<button  type="button" id="'+ saveButtonId +'" value="'+ sampleName[parseInt(i)] +'" class="btn btn-default btn-raised btn-responsive">\
                        save <span class="icon-download icon-large"></span></button>';
                cardTitleDiv.innerHTML += ' <input class="btn btn-raised input-responsive btn-input" id="' + inputId+'" type="text" \
                        placeholder="sample' + (parseInt(i) + 1) +'">';
            }
                
            //Creating chart div based on sample name in array
            chartDiv.id = nameArray[i];
            chartDiv.className = "chartLoading";
        
            var image = document.createElement("img");
            image.setAttribute("src" ,"./images/preloader.gif");
            
            chartDiv.appendChild(image);
        
            //Apending cardtitle and chart div on card div
            cardDiv.appendChild(cardTitleDiv);
            cardDiv.appendChild(chartDiv);
        
            //Appending card div on bootsrap col div element
            colDiv.appendChild(cardDiv);
            
            //Adding col div to parent row div with id (samplerow)    
            var sampleDiv = document.getElementById('samplerow');
            sampleDiv.appendChild(colDiv);
        
    }
    
}

/**
 * Function to create chart on dynamically created grids
 * Accepts following parameters and call sunburst module to create object
 * @param { array }  sampleDivName - Array of sample name.
 * @param { array } dataArray - Array of string containing path to data file
 */
function createChartOnDiv(sampleDivName, dataArray){
  
    // counter for iterating over sampleDivName
    var count = 0;
    //Empty chartobj if it contains element
    if(chartObj.length){
        chartObj.splice(0, chartObj.length);
    }
     
    dataArray.forEach(function(data){
       
        //Dynamicaly creating an object of sunburst chart
        var sunChart = sunburstD3();
        var chartArea = '#' + sampleDivName[count];
       
        d3.json(data, function(error, root) {
            d3.selectAll(".chartLoading img").style("display", "block");
        
            var chartContainer = d3.select(chartArea)
                .datum(root)
                .call(sunChart);
           
            d3.selectAll(".chartLoading img").style("display", "none");
        }); //end of d3.json
        
        count ++
        
        }); //end of forEach
    
}   //end of createChartOnDiv

/**
 * Function to check for mobile device
 * This function returns true or false.
 * Based on return value sunburst module changes the behavior for touch devices
 * @return { boolean } true/false - Based on presence or absence of device
 */
function isMobileDevice(){
    return 'ontouchstart' in window ;
}


/**
 * Function to order charts based on names provided in input field
 * Needs to get unique names from input feilds of chart divs
 */
 function orderCharts(){
    var newOrder;
    var inputVal = "" ;
    var newDataArray = [];
    var newSampleName = [];
   
    inputVal = getInputValue();
    newOrder = getInputValue(); 
    
    if( inputVal ){
        //Check for uniquenes of inputval array
        // If elements of array are unique change the order
        if( isUnique(newOrder.sort()) ){
            
            for(var i in newOrder){
            
                for( var j in inputVal){
                
                    if( newOrder[i] == inputVal[j] ){ 
                        newDataArray.push(dataSet[j]);
                        newSampleName.push(sampleName[j]);
                    }
                }
            }
            sampleName = newSampleName;
            dataSet = newDataArray;
        
            setInputValue(newSampleName);
            createChartOnDiv(refArea, newDataArray);
        
        }else{
            alert("Input unique names for chart");
        }
        
    }else{
        
    }
}

/**
 * Function to get the text from input fields of the chart divs.
 * Called from function : orderChart.
 * @returns {boolean|array} If all the input feilds contains input text return array else false.
 */
function getInputValue(){
    
    var inputId = "";
    var inputValue = [];
   
    for( var i = 0; i < chartObj.length; i++){ 
        
        inputId = 'inputsample'+ (i+1);
        // If all the input feilds contains input text return array
        // If any input feild is left black, create alert and return false.
        if(document.getElementById(inputId).value){
            inputValue.push(document.getElementById(inputId).value);
        }
        else{
            alert("Specify a chart name for div " + (i+1) );
            return false;
        }
    }
    
    return inputValue;
}

/**
 * Function to set the placeholder text in input fields of the chart divs.
 * Called from function : orderChart.
 */
function setInputValue(orderArray){
 
    var inputId, saveId;
    for( var i = 0; i < chartObj.length; i++){ 
        
        inputId = 'inputsample' + (i+1);
        saveId = 'savesample' + (i+1);

        if(document.getElementById(inputId).value){
            document.getElementById(inputId).value = '';
            document.getElementById(inputId).placeholder = orderArray[i];
            document.getElementById(saveId).value = orderArray[i];
        }
    }
}
/**
 * Function to check the uniqueness of array elements. 
 * Called from function : orderChart.
 * @param {array} nameArray - Array of string contaning id of sample data.
 * @returns {boolean} true if array elements contains unique names of string else false. 
 */
function isUnique(nameArray){
    
    for(var i = 1; i < nameArray.length ; i++){
        if(nameArray[i-1] == nameArray[i]){
            return false;
            break;
        }
    }
    return true;
}

/**
 * Function to load json config file.
 * async is turned off 
 * Called from function : orderChart.
 * @param {function} callback - callback function.
 * @returns {callback} object - returns json object.
 */
function loadataConfig(callback){
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', './data/input/setting_dataFile.json', false);
    xobj.onreadystatechange = function(){
        if(xobj.readyState == 4 && xobj.status == "200"){
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
