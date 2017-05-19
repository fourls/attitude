<?php
$level = $_GET["level"];
$filename = $_GET["id"];

file_put_contents("userlevels/" . $filename . ".json",$level);
?>