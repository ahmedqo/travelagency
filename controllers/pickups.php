<?php
ob_start();
include_once(dirname(__DIR__) . "/models/session.php");
include_once(dirname(__DIR__) . "/models/pickups.php");
include_once(dirname(__DIR__) . "/controllers/utils.php");

$METHOD = $_SERVER["REQUEST_METHOD"];
$ses = new Session();
$req = new Pickups();

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "delete") {  
    $pickup = array(":id"=>$_POST["id"]);
    
    $res = $req->delete($pickup);
    if (!$res) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    echo makeResponse(200, "success", "Successfully Deleted.");
    exit();
}
