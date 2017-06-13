/* STEPS
		   1. Draw map data using (geojson)
		   2. get meteorites data (geojson)
		   3. plot meteorites
		   4. use tooltips to display more information when hovering over a meteorite.
		   */

// get json data
d3.json(
  "https://gist.githubusercontent.com/abkunal/ff9934aa08993a9761cd7ee1939cbb0e/raw/3744f74744ad274a1f3cfac75d1839f21777a4f1/world_countries.json",
  function(data) {
    // initializing boundary values of the visualization
    var margin = { top: 20, right: 15, bottom: 20, left: 15 };
    var w = 1300 - margin.left - margin.right,
      h = 750 - margin.top - margin.bottom;

    // tooltip body
    var tip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([200, 100])
      .html(function(d) {
        return (
          "<strong>Fall: </strong>" +
          d.properties.fall +
          "<br>" +
          "<strong>Mass: </strong>" +
          d.properties.mass +
          "<br>" +
          "<strong>Name: </strong>" +
          d.properties.name +
          "<br>" +
          "<strong>Nametype: </strong>" +
          d.properties.nametype +
          "<br>" +
          "<strong>Reclass: </strong>" +
          d.properties.reclass +
          "<br>" +
          "<strong>Reclat: </strong>" +
          d.properties.reclat +
          "<br>" +
          "<strong>Year: </strong>" +
          new Date(d.properties.year).getFullYear() +
          "<br>"
        );
      });

    // inserting svg into the webpage
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom);

    svg.call(tip);

    // projection used to convert 3D coordinates into 2D pixel values;
    var projection = d3.geo.mercator().scale(200).translate([w / 2, h / 1.8]);

    // creates a new geographical path generator using instantiated projection
    var path = d3.geo.path().projection(projection);

    // generating the map of the world on the webpage
    svg
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", "#dff")
      .style("stroke", "black")
      .style("stroke-width", 0.5);

    // get meteorites data
    d3.json(
      "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json",
      function(meteor) {
        // find the minimum and maximum mass of the meteorites
        var mass_extent = d3.extent(meteor.features, function(d) {
          return parseInt(d.properties.mass);
        });

        // radius scale to scale mass values into pixel range
        var radius = d3.scale.sqrt().domain(mass_extent).range([1, 40]);

        // d3 category10 colors
        var c10 = d3.scale.category10();

        // insert the meteorites(circles) into the svg
        var circles = svg
          .selectAll("circle")
          .data(meteor.features)
          .enter()
          .append("circle")
          .attr("class", "circle")
          .attr("cx", function(d) {
            if (d.geometry !== null)
              return projection(d.geometry.coordinates)[0];
            else return 0;
          })
          .attr("cy", function(d) {
            if (d.geometry !== null)
              return projection(d.geometry.coordinates)[1];
            else return 0;
          })
          .attr("r", function(d) {
            return radius(d.properties.mass);
          })
          .style("fill", function(d) {
            r = radius(d.properties.mass);

            if (r >= 1 && r <= 3) return c10(0);
            else if (r > 3 && r <= 6) return c10(1);
            else if (r > 6 && r <= 9) return c10(2);
            else return c10(3);
          })
          .style("opacity", 0.8)
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide);

        // Title of the Visualization
        svg
          .append("text")
          .text("Meteorites Landing around the World")
          .attr("x", 0)
          .attr("y", 480);
      }
    );
  }
);