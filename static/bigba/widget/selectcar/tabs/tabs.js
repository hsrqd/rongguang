define('bigba:widget/selectcar/tabs/tabs.js', function(require, exports, module){ var options = {
    $AutoPlay: false,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
    $AutoPlaySteps: 1,                                  //[Optional] Steps to go for each navigation request (this options applys only when slideshow disabled), the default value is 1
    $AutoPlayInterval: 4000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
    $PauseOnHover: 1,                               //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1
    $Loop: 0,                                       //[Optional] Enable loop(circular) of carousel or not, 0: stop, 1: loop, 2 rewind, default value is 1

    $ArrowKeyNavigation: true,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
    $SlideDuration: 500,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
    $MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
    //$SlideWidth: 600,                                 //[Optional] Width of every slide in pixels, default value is width of 'slides' container
    //$SlideHeight: 300,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
    $SlideSpacing: 5, 					                //[Optional] Space between each slide in pixels, default value is 0
    $DisplayPieces: 1,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
    $ParkingPosition: 0,                                //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
    $UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
    $PlayOrientation: 1,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
    $DragOrientation: 3,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)

    $ThumbnailNavigatorOptions: {
        $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
        $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
        $Loop: 2,                                       //[Optional] Enable loop(circular) of carousel or not, 0: stop, 1: loop, 2 rewind, default value is 1
        $AutoCenter: 3,                                 //[Optional] Auto center thumbnail items in the thumbnail navigator container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 3
        $Lanes: 1,                                      //[Optional] Specify lanes to arrange thumbnails, default value is 1
        $SpacingX: 2,                                   //[Optional] Horizontal space between each thumbnail in pixel, default value is 0
        $SpacingY: 2,                                   //[Optional] Vertical space between each thumbnail in pixel, default value is 0
        $DisplayPieces: 4,                              //[Optional] Number of pieces to display, default value is 1
        $ParkingPosition: 0,                            //[Optional] The offset position to park thumbnail
        $Orientation: 2,                                //[Optional] Orientation to arrange thumbnails, 1 horizental, 2 vertical, default value is 1
        $DisableDrag: true                             //[Optional] Disable drag or not, default value is false
    }
};
//{id,name,num}
var selectData = [];
var selectTpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<span>您已选择：</span><span>    ');for(var i=0,len=data.length;i<len;i++){var item = data[i];_template_fun_array.push('    <span><input class="select" type="checkbox" checked>',typeof(item.name) === 'undefined'?'':baidu.template._encodeHTML(item.name),' ',typeof(item.num) === 'undefined'?'':baidu.template._encodeHTML(item.num),' 辆</span>    ');}_template_fun_array.push('</span>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
module.exports = Widget.extend({
    el: '#select-car-widget',
    events: {
        'click [data-node=nextBtn]': 'nextBtnClick'
    },
    init : function() {
        this.initEvent();
    	var galleryList = $(".slider_con");
    	galleryList.each(function(i,ele){
    		new $JssorSlider$(ele, options);
    	});
    },
    initEvent:function(){

        var me = this;
        me.$el.find(".car-list .detail").click(function(){
            var _par = $(this).parent("[data-node=car-box]");
            //$(this).attr("data-id")
            _par.toggleClass("select");
            var _name = $(this).attr("data-name");
            var _id = $(this).attr("data-id");
            var _num =  1 || $(this).find("data-node=num").val();
            if(_par.hasClass("select")){
                //selectData[]
                me.addCar(_id,_name,_num);
                //alert($(this).attr("data-id"));
            }else{
                me.removeCar($(this).attr("data-id"));
            }
            me.renderSelect();
        });
    },
    addCar: function(id,name,num){
        //check if exist
        var _exist = false;
        for(var i=0,len=selectData.length;i<len;i++){
            if(selectData[i].id == id){
               selectData[i].num + num;
               _exist = true;
               break; 
            }
        }
        if(!_exist){
            selectData.push({id:id,name:name,num:num});
        }
        return;
    },
    removeCar: function(id){
        var _index = -1;
        for(var i=0,len=selectData.length;i<len;i++){
            if(selectData[i].id == id){
               _index = i;
               break; 
            }
        }
        if(_index != -1){
            selectData.splice(_index,1);
        }
        return;
    },
    renderSelect:function(){
        this.$el.find("[data-node=selectMsg]").html(selectTpl({data:selectData}));
    },
    nextBtnClick: function(){
        var _form = $("[data-node=nextForm]");
        if(!selectData.length){alert("请至少选择一辆车");return;}
        for(var i=0,len=selectData.length;i<len;i++){
            _form.append('<input type="checkbox" name="car_id_list[]" value="'+selectData[i].id+'" />');
            _form.append('<input type="checkbox" name="car_num_list['+selectData[i].id+']" value="'+selectData[i].num+'" />');
        }
        debugger;
        _form.submit();
    }
});
 
});