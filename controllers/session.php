<?php
ob_start();
include_once(dirname(__DIR__) . "/models/session.php");

$METHOD = $_SERVER["REQUEST_METHOD"];

if ($METHOD == "POST"  && $_POST["action"] == "get") {
    $ses = new Session();
    echo json_encode($ses->get());
    exit();
}

if ($METHOD == "POST"  && $_POST["action"] == "clear") {
    $ses = new Session();
    $ses->clear();
    echo json_encode(array(0 => true));
    exit();
}
