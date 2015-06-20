<?php
function get_int_path($fdir, $fname=''){
	$int_path = "";
	$fdir = trim($fdir);
	$fname = trim($fname);

	#base_dir
	$base_dir = dirname($_SERVER['DOCUMENT_ROOT'] . $_SERVER['SCRIPT_NAME']);
	$base_dir = str_replace('//', '/', $base_dir);

	// Windows compatibility, remove drive letter (C:, D:, etc)
	$base_dir = preg_replace('/^([A-Z]):/', '', $base_dir);

	#path
	if( $fname!="" ){
		$int_path = "$base_dir/$fdir/$fname";
	}else{
		$int_path = "$base_dir/$fdir";
	}
	$int_path = str_replace('//', '/', $int_path);
	//$int_path = preg_replace('/\/$/', '', $int_path);

	#return
	return $int_path;
}

define('SMARTY_DIR', get_int_path('smarty-3.1.21/libs/'));

// load Smarty library
require_once(SMARTY_DIR . 'Smarty.class.php');

// The setup.php file is a good place to load
// required application library files, and you
// can do that right here. An example:
// require('guestbook/guestbook.lib.php');

class Smarty_Setup extends Smarty {
	var $template_int_path = '';
   function __construct()
   {
        // Class Constructor.
        // These automatically get set with each new instance.

        parent::__construct();

		$this->template_int_path = get_int_path('');
		//$this->template_int_path = '';
		
        $this->setTemplateDir($this->template_int_path.'template/');
        $this->setCompileDir($this->template_int_path.'templates_c/');
        $this->setConfigDir($this->template_int_path.'config/');
        $this->setCacheDir($this->template_int_path.'cache/');
        $this->setLeftDelimiter('{%');
        $this->setRightDelimiter('%}');
        
        $this->addPluginsDir($this->template_int_path.'plugin/');
        
        $this->caching = Smarty::CACHING_LIFETIME_CURRENT;
        $this->assign('app_name', '北京荣光伟业租车');
   }

}
?>