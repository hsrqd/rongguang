define("bigba:widget/selectcar/usecar/usecar.js",function(a,e,i){function n(){new o.Calendar($.extend({input:"from_date"},s)),new o.Calendar($.extend({input:"back_date"},s))}var o=a("bigba:static/libs/plugin/calendar/calendar.js"),t={$AutoPlay:!1,$AutoPlaySteps:1,$AutoPlayInterval:4e3,$PauseOnHover:1,$Loop:0,$ArrowKeyNavigation:!0,$SlideDuration:500,$MinDragOffsetToSlide:20,$SlideSpacing:5,$DisplayPieces:1,$ParkingPosition:0,$UISearchMode:1,$PlayOrientation:1,$DragOrientation:3,$ThumbnailNavigatorOptions:{$Class:$JssorThumbnailNavigator$,$ChanceToShow:2,$Loop:2,$AutoCenter:3,$Lanes:1,$SpacingX:2,$SpacingY:2,$DisplayPieces:4,$ParkingPosition:0,$Orientation:2,$DisableDrag:!0}},s={onSelectDay:function(a,e){console.log(a),console.log(e)},disableHolidays:!0};i.exports={init:function(){this.$el=$(".widget-selectcar-tabs");var a=$(".slider_con");a.each(function(a,e){new $JssorSlider$(e,t)}),n()}}});