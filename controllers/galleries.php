<?php
ob_start();
include_once(dirname(__DIR__) . "/models/session.php");
include_once(dirname(__DIR__) . "/models/galleries.php");
include_once(dirname(__DIR__) . "/controllers/utils.php");

$METHOD = $_SERVER["REQUEST_METHOD"];
$ses = new Session();
$req = new Galleries();

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "deleteAll") {    
    $IMAGEDR = array_slice(scandir(dirname(__DIR__) . "/static/storage/"), 2);
    $IMAGEDB = array();
    $images = $req->getAll();

    for ($i = 0; $i < count($images); $i++) {
        array_push($IMAGEDB, $images[$i]["image"]);
    }

    for ($i = 0; $i < count($IMAGEDR); $i++) {
        if (!in_array($IMAGEDR[$i], $IMAGEDB)) {
            $req->deleteImages($IMAGEDR[$i]);
        }
    }
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "delete") {  
    $gallery = array(":id" => $_POST["id"]);
    
    $res = $req->delete($gallery);
    if (!$res) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    echo makeResponse(200, "success", "Successfully Deleted.");
    exit();
}
