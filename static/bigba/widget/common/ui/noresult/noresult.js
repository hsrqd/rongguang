define('bigba:widget/common/ui/noresult/noresult.js', function(require, exports, module){ var tmpl = [function(_template_object
/**/) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="no-result">    <div class="no-result-image" style="padding:80px 0 20px;">        <img src="" alt="无结果" style="display:block;margin:auto;">    </div>    <div class="no-result-notice" style="text-align:center;padding-bottom: 50px;"></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var img_src = '/static/images/noresult.png';
module.exports = {
    show: function(msg, container,imgsrc) {
        if(imgsrc){
            img_src = imgsrc;
        }
        $container = $(container);
        $container.html(tmpl()).find('.no-result-notice').html(msg);
        $container.find('img').attr('src', img_src);
        this.$container = $container;
    },
    hide: function() {
        this.$container.find('.no-result').remove();
    }
}; 
});