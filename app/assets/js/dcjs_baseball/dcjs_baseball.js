d3.json("http://tranquil-peak-82564.herokuapp.com/api/v1.0/data/baseball/limit/100/", function(my_data){

var appearances   = crossfilter(my_data);
var appsByTeams   = appearances.dimension(function(d){return d.team_id});
var appsByYear    = appearances.dimension(function(d) {return Math.floor(d.year/10)});
var appsByTeamSum = appsByTeams.group().reduceSum(function(d){return d.g_all});
var appsByYearSum = appsByYear.group().reduceSum(function(d){return d.g_all});
var team_names    = _.chain(my_data).pluck("team_id").uniq().value();

var pie = dc.pieChart("#dcjs_baseball_piechart","group1")
	.width(500)
  .height(300)
  .radius(125)
  .innerRadius(50)
  .dimension(appsByYear)
  .group(appsByYearSum)
  .renderLabel(true)
  .label(function (d) { return (d.data.key*10 + "-" + (d.data.key + 1)*10%100 ); });
    
var bar = dc.barChart("#dcjs_baseball_barchart", "group1")
  .width(600)
  .height(300)
  .dimension(appsByTeams)
  .group(appsByTeamSum)
  .x(d3.scale.ordinal().domain(team_names))
  .xUnits(dc.units.ordinal)
  .elasticY(true)
  .centerBar(true);

var showButton = function(){
	if(pie.filters().length > 0 || bar.filters().length > 0){
 	 d3.select(".btn-btn")
      .remove();
   d3.select("#dcjs_baseball_reset_button")
  	.append("button")
    .attr("type","button")
    .attr("class","btn-btn")
    .append("div")
    .attr("class","label")
    .text(function(d) { return "Reset";})
    .on("click", function(){
    	bar.filter(null);
      pie.filter(null);
      dc.redrawAll("group1");
    })
  }
  else{
    d3.select(".btn-btn")
      .remove();
    };
};

bar.on('filtered', function(){showButton();});
pie.on('filtered', function(){showButton();});
  
dc.renderAll("group1");
});