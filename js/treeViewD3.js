/**
 * inspiration from
 * - http://bl.ocks.org/mbostock/4339083
 * - https://gist.github.com/robschmuecker/7880033
 * - http://www.brightpointinc.com/interactive/budget/index.html?source=d3js
 */
treeViewD3 = function module() {

  var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

  var i = 0,
    duration = 750,
    widthScale,
    nodeName = [],
    root,
    svg;

  var tree = d3.layout.tree()
    .nodeSize([2, 105])
    .separation(function (a, b) {
      var width = (nodeSize(a) + nodeSize(b)),
        distance = width / 2 + 5;
      return (a.parent === b.parent) ? distance : distance + 4;
    });

  // Custom color category 
  var color = d3.scale.ordinal().range(["#8dd3c7", "#1f78b4", "#e5c494", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#bc80bd", "#ccebc5", "#ffed6f", "#b15928"]);

  // Calculate total nodes, max label length
  var totalNodes = 0;
  var maxLabelLength = 0;
  // panning variables
  var panSpeed = 200;
  var panBoundary = 20; // Within


  function zoom() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);


  function centerNode(source) {
    scale = zoomListener.scale();
    x = -source.y0;
    y = -source.x0;
    x = x * scale + width / 2;
    y = y * scale + height / 2;

    d3.select('g').transition()
      .duration(duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");

    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
  }


  var diagonal = d3.svg.diagonal()
    .projection(function (d) {
      return [d.y, d.x];
    });

  widthScale = d3.scale.linear().range([2, 105]);

  function nodeSize(d) {

    if (d.selected) {
      return widthScale(d.mean) * 2;
    } else {
      return 2;
    }
  }


  function exports(_selection) {
    _selection.each(function (_data) {

      svg = d3.select(this).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .call(zoomListener)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      widthScale.domain([0, 4]);

      root = _data;
      root.x0 = height / 2;
      root.y0 = 0;

      console.log(root)
      // set everything visible
      function setVisible(d) {
        d.selected = true;
        if (d.children) {
          d.children.forEach(setVisible);
        }
      }

      setVisible(root);

      // collapse everything
      function collapseAll(d) {
        if (d.children && d.children.length === 0) {
          d.children = null;
        }
        if (d.children) {
          d._children = d.children;
          d._children.forEach(collapseAll);
          d.children = null;
        }
      }

      collapseAll(root);
      expand(root);


      update(root);
      //typeaHead(nodeName)
      centerNode(root.children[0]);

    }); //end of selection
  } // end of export

  // Expands a node for i levels
  function expand(d, i) {
    var local_i = i;
    if (typeof local_i === "undefined") {
      local_i = 2;
    }
    if (local_i > 0) {
      if (d._children) {
        d.children = d._children;
        d._children = null;
      }
      if (d.children) {
        d.children.forEach(function (c) {
          expand(c, local_i - 1);
        });
      }
    }
  }

  // Collapses a node
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    }
  }

  d3.select(self.frameElement).style("height", "500px");
  d3.select("#saveTree").on("click", exportAsImage);

  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Set widths between levels based on maxLabelLength.
    nodes.forEach(function (d) {
      nodeName.push(d.name);
      d.y = (d.depth * 230); //maxLabelLength * 10px
    });

    var depthCounter = 0;
    /* Normalize for fixed-depth.
        nodes.forEach(function (d) {
        
            if (d.depth == 1) {
                d.linkColor = color[(depthCounter % (color.length - 1))];
                depthCounter++;
            }
            if (d.numChildren == 0 && d._children) d.numChildren = d._children.length;

        });
        */

    /*Set link colors based on parent color
        nodes.forEach(function (d) {
            var obj = d;
            while ((obj.source && obj.source.depth > 1) || obj.depth > 1) {
                obj = (obj.source) ? obj.source.parent : obj.parent;
            }
            d.linkColor = (obj.source) ? obj.source.linkColor : obj.linkColor;

        });
    */
    // Update the nodes…
    var node = svg.selectAll("g.node")
      .data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", click);

    nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("stroke-width", "2.5px")
      .style("stroke", function (d) {
        if (d.selected) {
          return getColor(d.name) || "#aaa";
        } else {
          return "#aaa";
        }
      })
      .style("fill", function (d) {
        if (d.selected) {
          return d._children ? getColor(d.name) || "#aaa" : "#fff";
        } else {
          return "#aaa";
        }
      });

    nodeEnter.append("text")
      .attr("x", function (d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d) {
        return d.name;
      })
      .style("font", "10px sans-serif")
      .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    nodeUpdate.select("circle")
      .attr("r", nodeSize)
      .style("fill-opacity", function (d) {
        return d._children ? 1 : 0;
      })
      .style("stroke", function (d) {
        if (d.selected) {
          return getColor(d);
        } else {
          return "#aaa";
        }
      })
      .style("fill", function (d) {
        if (d.selected) {
          return d._children ? getColor(d) || "#aaa" : "#fff";
        } else {
          return "#aaa";
        }
      });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
      .data(links, function (d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .style("fill", "none")
      .style("stroke-opacity", "0.6")
      .style("stroke-linecap", "round")
      .style("stroke", function (d) {
        if (d.source.selected) {
          return getColor(d.target);
        } else {
          return "#aaa";
        }
      })
      .style("stroke-width", 1e-6)
      .attr("d", function (d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal)
      .style("stroke", function (d) {
        if (d.source.selected) {
          return getColor(d.target);
        } else {
          return "#e5c494";
        }
      })
      .style("stroke-width", function (d) {
        if (d.source.selected) {
          return widthScale(d.target.mean * 5) + "px";
        } else {
          return "5px";
        }
      });

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .style("stroke-width", 1e-6)
      .attr("d", function (d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

  } //end of update

  var substringMatcher = function (strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;

      // an array that will be populated with substring matches
      matches = [];

      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');

      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function (i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });

      cb(matches);
    };
  };

  function getColor(d) {

    if (d.depth == 0) {
      return "green";
    }
    var fadeColor = 1;

    while (d.depth > 2) {
      d = d.parent;
    }
    var c = d3.lab(color(d.name))
    //.brighter();
    return c;
  }

  function typeaHead(nodeName) {
    $('#the-basics .typeahead').typeahead({
      name: 'Node-Name',
      hint: true,
      highlight: true,
      minLength: 1
    }, {
      name: 'nodeName',
      source: substringMatcher(nodeName)
    });
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
    centerNode(d);
  }

  //Saving the svg element as png on save button 
  function exportAsImage() {

    var svg = document.querySelector('svg');

    var svgData = new XMLSerializer().serializeToString(svg);

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    canvas.height = height;
    canvas.width = width;
    var dataUri = '';
    dataUri = 'data:image/svg+xml;base64,' + btoa(svgData);

    var img = document.createElement("img");

    img.onload = function () {
      ctx.drawImage(img, 0, 0);

      // Initiate a download of the image
      var a = document.createElement("a");

      a.download = "treeview" + ".png";
      a.href = canvas.toDataURL("image/png");
      document.querySelector("body").appendChild(a);
      a.click();
      document.querySelector("body").removeChild(a);

      // Image preview in case of "save image modal"

      /*var imgPreview = document.createElement("div");
        imgPreview.appendChild(img);
        document.querySelector("body").appendChild(imgPreview);
      */
    };

    img.src = dataUri;
  }


  //export function to modules
  exports.width = function (_) {
    if (!argument.length) return width;
    width = _;
    return exports;
  }

  exports.height = function (_) {
    if (!argument.length) return height;
    height = _;
    return exports;
  }

  //d3.rebind(exports, dispatch, "on");
  return exports;

} //end of module
