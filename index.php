<?php
require('smart_setup.php');
$smarty = new Smarty_Setup();

		
$smarty->assign('Top_Num_Employees', '24');

$smarty->display('bigba/page/index.tpl');

?>