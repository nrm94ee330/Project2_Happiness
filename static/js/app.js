function builddata(sample) {
  url="/years/" + sample;

}

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample


    d3.json("/years/" + sample).then(function(response) {

      // console.log(response);

      // Use d3 to select the panel with id of `#sample-metadata`
      //var selector = d3.select("#sample-metadata");
      

      var table = d3.select("#sample-metadata");
      var tbody = table.select("tbody");
      var trow;


      var keys = Object.keys(response);
      // console.log(response);
      // console.log(response.Country.length);
      // console.log(keys.length);
        tbody.html("") 

        trow = tbody.append("tr");
        for (var i = 0; i < keys.length; i++) {
          trow.append("th").text(keys[i]);
        }
        var j;
        for (var j = 0; j < response.Country.length; j++) {
          trow = tbody.append("tr");
          for (var i = 0; i < 1; i++) {
            trow.append("td").text(response[keys[i]][j]);
          }
          for (var i = 1; i < keys.length; i++) {
            trow.append("td").text(Math.round(response[keys[i]][j]*100)/100);
            // console.log(response[keys[i]])
          }
        }
    })
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample,data_type,chart_type) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
  url="/years/" + sample;

  if(chart_type == "bar"){

  d3.json(url).then(function(data) {
    var names = data.country;
    var stock = data[data_type];
    var label_names=data["Country"];

    // console.log(stock);
    // console.log(label_names);

    var trace1 = {
      type: chart_type,
      x: names,
      y: stock,
      text:label_names
    };

    var data = [trace1];

    var layout = {
      title: `${data_type} ${sample}`,
      yaxis: {
        autorange: true,
        type: "linear",
        title: data_type,
      },
      xaxis: {
        autorange: true,
        type: "linear",
        title: "Country",
        text: label_names,
      },       
    };
  // @TODO: Build a Bubble Chart using the sample data  
      Plotly.newPlot("bubble", data, layout);

    });    
  }

  if(chart_type == "bubble"){

      d3.json(url).then(function(data) {
        // console.log("Here");
        // console.log(sample);
        // console.log(data_type);
        // Grab values from the response json object to build the plots
        var name = data.country;
        var stock = data["Happiness_Score"];
        var label_names=data[data_type];
    
        var trace1 = {
          type: "bubble",
          mode: "markers",
          name: name,
          x: label_names,
          y: stock,
          marker: {
            size: name,
            color:name

          }
        };
    
        var data = [trace1];
    
        var layout = {
          title: `${data_type} ${sample}`,
          yaxis: {
            autorange: true,
            type: "linear",
            title: "Happiness Value",
          },
          xaxis: {
            autorange: true,
            type: "linear",
            title: data_type,
          },  
          
        };
      // @TODO: Build a Bubble Chart using the sample data  
        Plotly.newPlot("bubble", data, layout);

      });   
    }

    // d3.json(url).then(function(data) {

    
    //   var keys = Object.keys(data);
    //   console.log(data[keys[0]].slice(0,10));

    //   top_10otu_ids=data[keys[0]].slice(0,10);
    //   top_10otu_labels=data[keys[1]].slice(0,10)
    //   top_10sample_values=data[keys[2]].slice(0,10)
      

      
    //   // var sliced = Array.prototype.slice.call(data, 10);
    //   // console.log(sliced);
      
    //   // @TODO: Build a Pie Chart
    //   // HINT: You will need to use slice() to grab the top 10 sample_values,
    //   // otu_ids, and labels (10 each).
  
    //   var data = [{
    //     values: top_10sample_values,
    //     labels: top_10otu_ids,
    //     hovertext:top_10otu_labels,
    //     type: "pie"
    //   }];      

      

    //   var layout = {
    //     height: 600,
    //     width: 800
        
    //   };

    //   Plotly.plot("pie", data, layout);

    // }); 

}

function scatterButtons() {
  var buttonBoxWidth = 460;

  var svg = d3.select(element[0])
      .select('.rightDiv')
      .append("svg")
      .attr("class", "scatterButtons")
      .attr("width", "100%")
      .attr("height", buttonBoxHeight)
      .attr('viewBox', '0, 0, ' + buttonBoxWidth + ', ' + buttonBoxHeight)
      .attr("overflow", "visible");

      var allButtons = svg.append("g")
          .attr("id", "allButtons") 

      var buttonGroups = allButtons.selectAll("g.button")
          .data(metrics)
          .enter()
          .append("g")
          .attr("class", "button")
          .style("cursor", "pointer")
          .on("click", function(d, scatterStatus) {
              d3.selectAll("g.button")
                  .attr("opacity", buttonDefaultAlpha);
              d3.select(this).attr("opacity", buttonPressedAlpha)
              d3.select("#numberToggle").text(scatterStatus)
              updateScatter('country', countries, scatterStatus);
              })
          .on("mouseover", function(d, i) {
              d3.select("#scatterButtonText" + i)
              .style("opacity", 1);


              if (d3.select(this).attr("opacity") != buttonPressedAlpha) { 
                  d3.select(this)
                      .attr("opacity", buttonHoverAlpha)};
                  })
          .on("mouseout", function(d, i){
              d3.select("#scatterButtonText" + i)
                  .style("opacity", 0);

              if (d3.select(this).attr("opacity") != buttonPressedAlpha) { 
                  d3.select(this)
                      .attr("opacity", buttonDefaultAlpha)};
                  })
           .attr("opacity", function(d,i) { //setting inital opactiy when page is loaded
                  if (i == "0") {
                          return buttonPressedAlpha;
                          }
                  else {return buttonDefaultAlpha}             
                  });

  buttonGroups.append("svg:image")
          .attr("x", function(d,i) {return x0 + (bWidth + bSpace)*i;})
          .attr("y", y0)
          .attr('width', bWidth)
          .attr('height', bHeight)
          .attr("xlink:href", function(i) {return "imgs/" + i + ".png";});

  buttonGroups.append("text")
      .attr("class","scatterButtonTexts")
      .attr("id", function(d, i) {return "scatterButtonText" + i;})
      .attr("x",function(d,i) {
          return 25 + (bWidth + bSpace)*i - scatterButtonText[i].length*3.5;
              })
      .attr("y", bHeight + 8)
      .attr("text-anchor", "bottom")
      .attr("dominant-baseline", "central")
      .attr("fill", metricButtonTextColor)
      .style("opacity", 0)
      .text(function(d, i) {return scatterButtonText[i];});

}

function init() {
  // Grab a reference to the dropdown select element
  var firstSample="";
  var data_type="";
  
  var selector = d3.select("#selDataset");
  var selector2 = d3.select("#selVarset");
  var selector3 = d3.select("#selChartset");
  selector3.append("option").text("bubble").property("chart", "bubble");
  selector3.append("option").text("bar").property("chart", "bar");

  // Use the list of sample names to populate the select options
  d3.json("/years").then((sampleNames) => {
    sampleNames.forEach((year_obj) => {
      selector
        .append("option")
        .text(year_obj["year"])
        .property("year", year_obj["year"]);
      });
    // Use the first sample from the list to build the initial plots
    firstSample = sampleNames[0].year;
  });

  d3.json("/vars").then((sampleNames) => {
    sampleNames.forEach((year_obj) => {
      selector2
        .append("option")
        .text(year_obj["vars"])
        .property("vars", year_obj["vars"]);
      });
    // Use the first sample from the list to build the initial plots
    firstSample2 = sampleNames[0].vars;
  });



  buildMetadata(2014);
  buildCharts(2014,"Dystopia_Residual","bubble");
  // scatterButtons();
  
}




function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  var sel = document.getElementById('selVarset');
  var sel2 = document.getElementById('selChartset');
  // console.log(sel.options[sel.selectedIndex].value)
  
  buildCharts(newSample.value,  sel.options[sel.selectedIndex].value,sel2.options[sel2.selectedIndex].value);
  buildMetadata(newSample.value);
  
}

function optionVarChanged(newSample) {
  // Fetch new data each time a new sample is selected
  //buildmetadata(newSample);
  var sel = document.getElementById('selDataset');
  var sel2 = document.getElementById('selChartset');
  // console.log(sel.options[sel.selectedIndex].value)
  
  buildCharts(sel.options[sel.selectedIndex].value, newSample.value,  sel2.options[sel2.selectedIndex].value);
  
}

function optionChartChanged(newSample) {
  // Fetch new data each time a new sample is selected
  //buildmetadata(newSample);
  
  var sel = document.getElementById('selDataset');
  var sel2 = document.getElementById('selVarset');
  
  // console.log('Chart Type' + newSample.value);
  
  buildCharts(sel.options[sel.selectedIndex].value, sel2.options[sel2.selectedIndex].value,  newSample.value);
  
}

// Initialize the dashboard
init();
