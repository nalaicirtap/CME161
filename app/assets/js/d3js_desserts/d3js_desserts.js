// Patricia Lan
// Honesty Kim

var DataSet = function() {
  this.data = {
    "name":"Desserts",
    "children": [ {
    
    "name": "Donuts",
    "children": [{
        "id": "0001",
        "type": "donut",
        "name": "Cake",
        "ppu": 0.55,
        "children": [{
          "name": "batters",
          "children": [{
            "id": "1001",
            "name": "Regular"
          }, {
            "id": "1002",
            "name": "Chocolate"
          }, {
            "id": "1003",
            "name": "Blueberry"
          }, {
            "id": "1004",
            "name": "Devil's Food"
          }]
        }, {
          "name": "toppings",
          "children": [{
            "id": "5001",
            "name": "None"
          }, {
            "id": "5002",
            "name": "Glazed"
          }, {
            "id": "5005",
            "name": "Sugar"
          }, {
            "id": "5007",
            "name": "Powdered Sugar"
          }, {
            "id": "5006",
            "name": "Chocolate with Sprinkles"
          }, {
            "id": "5003",
            "name": "Chocolate"
          }, {
            "id": "5004",
            "name": "Maple"
          }]
        }]
      }, {
        "id": "0002",
        "type": "donut",
        "name": "Raised",
        "ppu": 0.55,
        "children": [{
          "name": "batters",
          "children": [{
            "id": "2001",
            "name": "Regular"
          }, {
            "id": "2002",
            "name": "Patricia"
          }]
        }, {

          "name": "toppings",
          "children": [{
            "id": "3001",
            "name": "None"
          }, {
            "id": "3002",
            "name": "Glazed"
          }, {
            "id": "3005",
            "name": "Sugar"
          }, {
            "id": "3003",
            "name": "Chocolate"
          }, {
            "id": "3004",
            "name": "Maple"
          }]
        }]
      },

      {
        "id": "0003",
        "type": "donut",
        "name": "Old Fashioned",
        "ppu": 0.55,
        "children": [{
          "name": "batters",
          "children": [{
            "id": "4001",
            "name": "Regular"
          }, {
            "id": "4002",
            "name": "Chocolate"
          }]
        }, {
          "name": "toppings",
          "children": [{
            "id": "6001",
            "name": "None"
          }, {
            "id": "6002",
            "name": "Glazed"
          }, {
            "id": "6003",
            "name": "Chocolate"
          }, {
            "id": "6004",
            "name": "Maple"
          }]
        }]
      }
    ]
    }, 
    
    
    
    {
        "id": "0004",
        "type": "bar",
        "name": "Bar",
        "ppu": 0.75,
        "children": [{
          "name" : "batters",
          "children": [{
            "id": "7001",
            "name": "Regular"
          }, ]
        }, {
        "name": "toppings",
        "children": [{
          "id": "8003",
          "name": "Chocolate"
        }, {
          "id": "8004",
          "name": "Maple"
        }]}, {
        "name":"fillings",

          "children": [{
            "id": "8001",
            "name": "None",
            "addcost": 0
          }, {
            "id": "8002",
            "name": "Custard",
            "addcost": 0.25
          }, {
            "id": "8009",
            "name": "Whipped Cream",
            "addcost": 0.25
          }]

      }]},
    ]
  }
};

var data_set = (new DataSet()).data;

var height = 1000,
  width = 1000;

var svg = d3
  .select("#hierarchy")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")
  .attr("transform", "translate(100,50)");

var tree = d3
  .layout
  .tree()
  .size([height/1.4, width/1.2]);

var diagonal = d3
  .svg
  .diagonal()
  .projection(function(d) {
    return [d.x, d.y];
  });

var search_term = "Patricia";



function findInPath(source, text) {
	if(source.children){
  	for(k=0; i<source.children.length; k++){
				findInPath(source.children[k], text);
        if(source.children[k].name===text){
        	return true;
        }
    	}
  }else{
  	return false;
  }
}

var linkFilter = function(d) {
  return findInPath(d.target, search_term)
}


data_set.x0 = height / 2;
data_set.y0 = 0;

var i = 0;
var duration = 2000;

update(data_set);

function update(source) {

  var nodes = tree.nodes(data_set);
  var links = tree.links(nodes);

  var node = svg.selectAll("g.node")
    .data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + source.x0 + "," + source.x0 + ")";
    })
    .on("click", click);

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("stroke", "steelblue")
    .style("stroke-width", "1.5px");

  nodeEnter.append("text")
    .attr("x", function(d) {
      return d.children || d._children ? -13 : 13;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function(d) {
      return d.name;
    })
    .style("fill-opacity", 1e-6)
    .style("font", "10px sans-serif")
    .style("fill", "black")
    .style("stroke-width", ".01px");



  var nodeUpdate = node.transition()
  	.ease("bounce")
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })


  nodeUpdate.select("circle")
    .filter(function(d) {
      return findInPath(d, search_term)
    })
    .style("fill", function(d) {
      return d._children ? "red" : "#faa";
    });

  nodeUpdate.select("circle")
    .filter(function(d) {
      return !findInPath(d, search_term)
    })
    .style("fill", function(d) {
      return d._children ? "lightsteelblue" : "#fff";
    });
  nodeUpdate.select("circle")
    .attr("r", 5)
    .style("stroke", "steelblue")
    .style("stroke-width", "3px");

  nodeUpdate.select("text")
    .style("fill-opacity", 1)
    .style("font", "10px sans-serif")
    .style("fill", "black")
    .style("stroke-width", ".01px")
    .attr("transform", "rotate(45)");


  var nodeExit = node.exit().transition()
    .ease("bounce")
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.x + "," + source.y + ")";
    })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);


  var link = svg.selectAll("path.link")
    .data(links, function(d) {
      return d.target.id;
    });

  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .style("fill", "none")
    .style("stroke-width", "1.5px");

  link.transition()
  	.ease("bounce")
    .duration(duration)
    .attr("d", diagonal);

  link.exit().transition()
    .duration(duration)
    .ease("bounce")
    .attr("d", function(d) {
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

  link.filter(linkFilter).style("stroke", "red");
  link.filter(function(d) {
    return !linkFilter(d);
  }).style("stroke", "ccc");

  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}