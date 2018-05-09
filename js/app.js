//parent and current node array for all data
var jsonData = [];
var currentDataNode = [];
var chartObj = [];
var pathObj = [];
//Array for chart div element
var refArea = [];
var current_breadcrumbs;

function init() {

  var dataSet = ["./data/taxonomy_tree.json", "./data/input/sample1_tree_data.json", "./data/input/sample2_tree_data.json",
                   "./data/input/sample3_tree_data.json"];

  //d3.json("./data/sample_names.json", function(error, json) {

  //   jsonData.push(json);

  //});   

  d3.json("./data/taxonomy_tree.json", function (error, treeData) {

    var treeView = treeViewD3();
    var container = d3.select("#treeView")
      .datum(treeData)
      .call(treeView);
  });

  //Iterating over dataSet object to get refArea name
  for (i in dataSet) {

    if (i > 0) {
      //Dynamically assign samplechart name and create respective divs
      refArea.push("sampleChart" + parseInt(i));
    }
  }

  //Creating ref area dynamically using refarea names
  createChartDiv(refArea);

  //Appending reference chart div element name
  refArea.unshift("chart");

  //Adding charts on created div elements
  createChartOnDiv(refArea, dataSet);


} //end of init()


function createChartDiv(nameArray) {


  for (i in nameArray) {

    var colDiv = document.createElement('div'),
      cardDiv = document.createElement('div'),
      cardTitleDiv = document.createElement('div'),
      chartDiv = document.createElement('div');

    colDiv.className = 'col-md-3 col-sm-6  col-xs-12';
    cardDiv.className = 'card card-block';
    //cardTitleDiv.className = 'card card-title';

    //Adding save and reset button to card title
    var saveButtonId = "saveChart" + (parseInt(i) + 1);

    cardDiv.innerHTML += ' <button  type="button" id="' + saveButtonId + '" class="btn btn-default btn-raised btn-responsive">save <span class="icon-download icon-large"></span></button>';

    //Creating chart div based on sample name in array
    chartDiv.id = nameArray[i];

    //Apending cardtitle and chart div on card div
    cardDiv.appendChild(cardTitleDiv);
    cardDiv.appendChild(chartDiv);

    //Appending card div on bootsrap col div element
    colDiv.appendChild(cardDiv);

    //Adding col div to parent row div with id (samplerow)    
    var sampleDiv = document.getElementById('samplerow');
    sampleDiv.appendChild(colDiv);

    //
  }

}

function createChartOnDiv(sampleDivName, dataArray) {

  // counter for iterating over sampleDivName
  var count = 0;


  dataArray.forEach(function (data) {
    //Dynamicaly creating an object of sunburst chart
    var sunChart = sunburstD3();
    var chartArea = '#' + sampleDivName[count];

    d3.json(data, function (error, root) {
      jsonData.push(root);

      var chartContainer = d3.select(chartArea)
        .datum(root)
        .call(sunChart);

    }); //end of d3.json

    count++
  }); //end of forEach

} //end of createChartOnDiv
