$(function(){
	var scrolling = false;
	var _height = $(".header").height() + $(".banner-con").height();
	function handleScroll(e){
		//console.log("scrolling:"+scrolling);
    	if(scrolling){
    		$("html,body").on("mousewheel",function(e){
    			e.preventDefault();
    			//return false;
    		});
    		e.preventDefault();
    		return;
    	}else{
    		$("html,body").off("mousewheel");
    	}
    	var _top = $(this).scrollTop();
    	//scroll down
    	if(e.deltaY<0){
    		if(_top < _height){
    			scrolling = true;
    			$("html,body").stop(true);
    			$(window).off("mousewheel");
    			//console.log("down animmate");
	    		$("html,body").animate(
	    			{scrollTop: _height+'px'}, 
	    			800, 
	    			"linear",
	    			function(){$(window).on("mousewheel",handleScroll);scrolling=false}
	    		);
	    	}else{
	    		return true;
	    	}
    	}else{ // scroll up
    		if(_top <= _height){
    			scrolling = true;
    			$("html,body").stop(true);
    			$(window).off("mousewheel");
    			//console.log("up animmate");
	    		$("html,body").animate(
	    			{scrollTop: '0px'}, 
	    			800, 
	    			'linear',
	    			function(){$(window).on("mousewheel",handleScroll);scrolling=false}
	    		);
	    	}else{
	    		return true;
	    	}
    	}
    }
    $(window).on("mousewheel",handleScroll);
});