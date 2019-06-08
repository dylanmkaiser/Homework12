function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    var url = `/metadata/${sample}`;
      d3.json(url).then(data => {
        // Use d3 to select the panel with id of `#sample-metadata`
        var sample_metadata = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        sample_metadata.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        var list = sample_metadata.append("ul");

        Object.entries(data).forEach(([key, value]) => {
          list.append("li").text(`${key}: ${value}`);
        });

    });
}

function buildCharts(sample) {

  // Use 'd3.json' to fetch the sample data 
  d3.json(`/samples/${sample}`).then((data) => {
    // Display the data in the console
    console.log(data)

    // Define the variables that we pull using 'd3.json' 
    var otu_ids = data.otu_ids;
    var sample_values = data.sample_values;
    var otu_labels = data.otu_labels;

    // Plot the bubble plot using otu_ids, sample_values, otu_labels data
    var trace_bubble = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      },
      text: otu_labels
    };

    var layout = {
      title: 'Bubble Plot',
      showlegend: false,
      height: 600,
      width: 1300
    };

    var data_bubble = [trace_bubble];
    
    // Plot to the "bubble" id in the index template
    Plotly.newPlot("bubble", data_bubble, layout);

    // Plot the pie chart using sample_values, otu_ids, otu_labels data
    var trace_pie = {
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      text: otu_labels.slice(0,10),
      hoverinfo: 'text',
      type: "pie"
    };

    // Change the layout to fit on the page
    var layout = {
      title: 'Pie Chart',
      height: 400,
      width: 1000
    };
    
    var data_pie = [trace_pie];
    
    // Plot to the "pie" id in the index template
    Plotly.newPlot("pie", data_pie, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
