var sst = 0;
var SST = 0;
var rSST = 0;
var SSTdisplay = 0;;
var count = 0;
var powerGauge;
var prev="";
var container = [];
var d = [];
var Vwidth = 0,
    Vheight = 0,
    Rwidth = 0;

var first = 'A';

var Btext = document.createElement('h5');
Btext.id = "Bhead";

define(["jquery", "./d3.min", "./d3.layout.cloud", "text!./styles.css"], function ($, d3) {
    'use strict';
    return {
        initialProperties : {
            version : 1.0,
            qHyperCubeDef : {
                qDimensions : [],
                qMeasures : [],
                qInitialDataFetch : [{
                    qWidth : 2,
                    qHeight : 100
                }]
            }
        },
        definition : {
            type : "items",
            component : "accordion",
            items : {
                measures : {
                    uses : "measures",
                    min : 1,
                    max : 1
				 /* items : {
                    dynamicColor : {
                            type  : "string",
                            label : "Colour Expression",
                            ref   : "qAttributeExpressions.0.qExpression",
		                    expression: "always"
                        }
                    
                  }*/
                },
                addons : {
                    uses : "addons",
                    items : {
                        
                        RadStart : {
                            ref : "RadStart",
                            label : "Lower Limit",
                            type : "number",
                            defaultValue : 0,
                            expression: "optional"
                        },
                        RadEnd : {
                            ref : "RadEnd",
                            label : "Higher Limit",
                            type : "number",
                            defaultValue : 100,
                            expression: "optional"
                        },
                        MaxSize : {
                            ref : "MaxSize",
                            label : "No of Segments",
                            type : "integer",
                            defaultValue : 6,
                            min : 2,
                            max : 20,
                            expression: "optional"
                        },
                        Lcolour : {
                            ref : "Lcolour",
                            label : "Lower Limit Colour",
                            type : "string",
                            defaultValue : "#ff0000",
                            expression: "optional"
                        },
                        Hcolour : {
                            ref : "Hcolour",
                            label : "Higher Limit Colour",
                            type : "string",
                            defaultValue : "#92d050",
                            expression: "optional"
                        },
					   Textcolor    : {  
                    ref: "zSRcolor",  
				    label : "Text Colour",
                    translation: "properties.color",  
                    type: "integer",  
                    component: "color-picker",  
                    defaultValue: 3  
                        }
                    }
                },
                settings : {
                    uses : "settings"
                }
			    
            }
        },
        snapshot : {
            canTakeSnapshot : true
        },
        paint : function ($element, layout) {
          
          debugger;
					console.log($element);
                    console.log(layout);
		  
          var format = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qFmt;
		  var d3Format;
          var value = layout.qHyperCube.qDataPages[0].qMatrix[0];
		  var textColor;
          sst = value[0].qNum;
		  SST = sst;
		  
		  if(format){ 
			
		  if(format.indexOf('%') != (-1)){
			d3Format = '<,%';
		  }else{
			//SST = Math.round(SST).toFixed(3);
		  }
			
			}
		  
		  if (layout.zSRcolor == 0){
			textColor = "#C7CED1";
		  }else if(layout.zSRcolor == 1){
			textColor = "#9AA3A6";
		  }else if(layout.zSRcolor == 2){
			textColor = "#5B6366";
		  }else if(layout.zSRcolor == 3){
			textColor = "#2B7BBD";
		  }else if(layout.zSRcolor == 4){
			textColor = "#A6C5DE";
		  }else if(layout.zSRcolor == 5){
			textColor = "#CBE3F7";
		  }else if(layout.zSRcolor == 6){
			textColor = "#58DB46";
		  }else if(layout.zSRcolor == 7){
			textColor = "#FF0000";
		  }else if(layout.zSRcolor == 8){
			textColor = "#FFD000";
		  }else if(layout.zSRcolor == 9){
			textColor = "#0A7818";
		  }else if(layout.zSRcolor == 10){
			textColor = "#FFFFFF";
		  }else if(layout.zSRcolor == 11){
			textColor = "#000000";
		  } 

      rSST = SST;
      SSTdisplay = rSST;
          
    var width = $element.width();
    var height = $element.height();
    var id = "container_" + layout.qInfo.qId;
 
    if (document.getElementById(id)) {
        $("#" + id).empty();
        $("#" + id).css("margin", "auto"); 
         //document.getElementById('Bhead').innerHTML = '';
    }
    else {
        $element.append($('<div />;').attr("id", id).width(width).height(height).css("margin", "auto !important"));
         // $("#" + id).append(Btext);
    }    
          
          if(value[0].qText != "" || value[0].qText != null() ){
            //layout.subtitle = value[0].qText;
          }   
          
            Vwidth = width;
            Vheight = height;
            Rwidth = width*0.15;
            var Vsize = height*1.4;
        
        viz(rSST,id,Vwidth,Vheight,Rwidth,Vsize,layout.Lcolour,layout.Hcolour,layout.RadStart,layout.RadEnd,layout.MaxSize,d3Format,value[0].qText,textColor); 
         
          //document.getElementById('Bhead').innerHTML = layout.title+' : '+value[0].qText;
        }
    };
});



// Gauge Visualization

function viz(value,id,width,height,radius,Csize,Lcolour,Hcolour,Radstart,Radend,Segments,format,textValue,textColor){
  
  if(!format){
	format = ',.2s';
  }
  
  
  var gauge = function(container, configuration) {
	var that = {};
	var config = {
		size						: Csize,
		clipWidth					: width,
		clipHeight					: height,
		ringInset					: 20,
		ringWidth					: 20,
		
		pointerWidth				: 10,
		pointerTailLength			: 5,
		pointerHeadLengthPercent	: 0.9,
        pointerColor                : d3.interpolateHsl(d3.rgb(Lcolour)),
		
		minValue					: Radstart,
		maxValue					: Radend,
		
		minAngle					: -90,
		maxAngle					: 90,
		
		transitionMs				: 750,
		
		majorTicks					: Segments,
		labelFormat					: d3.format(format),
		labelInset					: 10,
		
		arcColorFn					: d3.interpolateHsl(d3.rgb(Lcolour), d3.rgb(Hcolour))
	};
    
    // End Of Exp
  
  
	var range = undefined;
	var r = undefined;
	var pointerHeadLength = undefined;
	var value = 0;
	
	var svg = undefined;
	var arc = undefined;
	var scale = undefined;
	var ticks = undefined;
	var tickData = undefined;
	var pointer = undefined;

	var donut = d3.layout.pie();
	
	function deg2rad(deg) {
		return deg * Math.PI / 180;
	}
	
	function newAngle(d) {
		var ratio = scale(d);
		var newAngle = config.minAngle + (ratio * range);
		return newAngle;
	}
	
	function configure(configuration) {
		var prop = undefined;
		for ( prop in configuration ) {
			config[prop] = configuration[prop];
		}
		
		range = config.maxAngle - config.minAngle;
		r = config.size / 2;
		pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

		scale = d3.scale.linear()
			.range([0,1])
			.domain([config.minValue, config.maxValue]);
			
		ticks = scale.ticks(config.majorTicks);
		tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});
		
		arc = d3.svg.arc()
			.innerRadius(r - config.ringWidth - config.ringInset)
			.outerRadius(r - config.ringInset)
			.startAngle(function(d, i) {
				var ratio = d * i;
				return deg2rad(config.minAngle + (ratio * range));
			})
			.endAngle(function(d, i) {
				var ratio = d * (i+1);
				return deg2rad(config.minAngle + (ratio * range));
			});
	}
	that.configure = configure;
	
	function centerTranslation() {
		return 'translate('+r +','+ r +')';
	}
	
	function isRendered() {
		return (svg !== undefined);
	}
	that.isRendered = isRendered;
	
	function render(newValue) {
		svg = d3.select(container)
			.append('svg:svg')
				.attr('class', 'gauge')
				.attr('width', config.clipWidth)
				.attr('height', config.clipHeight);
		
		var centerTx = centerTranslation();
		
		var arcs = svg.append('g')
				.attr('class', 'arc')
				.attr('transform', centerTx);
		
		arcs.selectAll('path')
				.data(tickData)
			.enter().append('path')
				.attr('fill', function(d, i) {
					return config.arcColorFn(d * i);
				})
				.attr('d', arc);
		
		var lg = svg.append('g')
				.attr('class', 'label')
				.attr('transform', centerTx);
		lg.selectAll('text')
				.data(ticks)
			.enter().append('text')
				.attr('transform', function(d) {
					var ratio = scale(d);
					var newAngle = config.minAngle + (ratio * range);
					return 'rotate(' +newAngle +') translate(0,' +(config.labelInset - r) +')';
				})
				.text(config.labelFormat)
		        .attr('text-anchor','middle')
		        .attr('alignment-baseline','central');

		var lineData = [ [config.pointerWidth / 2, 0], 
						[0, -pointerHeadLength],
						[-(config.pointerWidth / 2), 0],
						[0, config.pointerTailLength],
						[config.pointerWidth / 2, 0] ];
		var pointerLine = d3.svg.line().interpolate('monotone');
		var pg = svg.append('g').data([lineData])
				.attr('class', 'pointer')
				.attr('transform', centerTx);
	  
	    var text = svg.append('text')
		           .text(textValue)
		           .attr('id','zMyText')
				   .attr('transform',function(d){
		            return 'translate('+ r +','+ r*0.8 +')';
		           })
		           .attr('text-anchor','middle')
		           .attr('alignment-baseline','central')
		           .attr('font-family','sans-serif')
		           .attr('fill',function(d){return textColor})
		           .attr('font-size','35px');
				
		pointer = pg.append('path')
			.attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
			.attr('transform', 'rotate(' +config.minAngle +')');
			
		update(newValue === undefined ? 0 : newValue);
	}
	that.render = render;
	
	function update(newValue, newConfiguration) {
		if ( newConfiguration  !== undefined) {
			configure(newConfiguration);
		}
		var ratio = scale(newValue);
		var newAngle = config.minAngle + (ratio * range);
		pointer.transition()
			.duration(config.transitionMs)
			.ease('elastic')
			.attr('transform', 'rotate(' +newAngle +')');
	}
	that.update = update;

	configure(configuration);
	
	return that;
};
  
function onDocumentReady() {
   
    powerGauge = gauge('#'+id, {
		size: Csize,
		clipWidth: width,
		clipHeight: height,
		ringWidth: radius,
		maxValue: Radend,
		transitionMs: 4000,
	});
  
	powerGauge.render();
    powerGauge.update(value);
} 
    onDocumentReady();
}
