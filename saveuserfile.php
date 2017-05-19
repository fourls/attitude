<?php
$level = $_GET["level"];
$filename = time();

file_put_contents("userlevels/" . $filename . ".json",$level);
?>