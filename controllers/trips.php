<?php
ob_start();
include_once(dirname(__DIR__) . "/models/session.php");
include_once(dirname(__DIR__) . "/models/trips.php");
include_once(dirname(__DIR__) . "/models/galleries.php");
include_once(dirname(__DIR__) . "/models/pickups.php");
include_once(dirname(__DIR__) . "/controllers/utils.php");

$METHOD = $_SERVER["REQUEST_METHOD"];
$LABELS = array(
    "trips" => [":id", ":title", ":description", ":destination", ":hotel", ":price", ":sits", ":reserved", ":date", ":time", ":status"],
    "galleries" => [":id", ":trip", ":image"],
    "pickups" => [":id", ":trip", ":location"],
);
$ses = new Session();
$Treq = new Trips();
$Greq = new Galleries();
$Preq = new Pickups();

if ($METHOD == "POST" && $_POST["action"] == "getAll") {
    $Tres = $Treq->getAll();
    for ($i = 0; $i < count($Tres); $i++) {
        $trip = makeDict([":trip"], [$Tres[$i]["id"]]);
        $Gres = $Greq->getByTrip($trip);
        $Pres = $Preq->getByTrip($trip);
        $Tres[$i] = array_merge($Tres[$i], array("images" => $Gres), array("pickups" => $Pres));
    }
    echo json_encode($Tres);
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "get") {
    $VALUES = [$_POST["id"]];

    $trip = makeDict(array_slice($LABELS["trips"], 0, 1), $VALUES);
    $Tres = $Treq->get($trip);
    $pickups = makeDict(array_slice($LABELS["pickups"], 1, 1), $VALUES);
    $Pres = $Preq->getByTrip($pickups);
    $gallery = makeDict(array_slice($LABELS["galleries"], 1, 1), $VALUES);
    $Gres = $Greq->getByTrip($gallery);

    $Tres["pickups"] = $Pres;
    $Tres["images"] = $Gres;
    echo json_encode($Tres);
}

if ($METHOD == "POST" && $_POST["action"] == "create") {
    $VALUES = [
        $_POST["title"], $_POST["description"], $_POST["destination"], $_POST["hotel"], $_POST["price"],
        $_POST["sits"], "0", $_POST["date"], $_POST["time"], "1", $_FILES["images"], $_POST["pickups"]
    ];

    $trip = makeDict(array_merge(array_slice($LABELS["trips"], 1), ["images", "pickups"]), $VALUES);
    if (!checkEmpty($trip)) {
        echo makeResponse(400, "danger", "All Fields Required.");
        exit();
    }

    $trip = makeDict(array_slice($LABELS["trips"], 1), array_slice($VALUES, 0, -2));
    $Tres = $Treq->create($trip);
    if (!$Tres) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    $pickup = makeDict(array_slice($LABELS["pickups"], 1), array_merge([$Tres], array_slice($VALUES, -1)));
    $Pres = $Preq->create($pickup);
    if (!$Pres) {
        $trip = makeDict(array_slice($LABELS["trips"], 1, 1), [$Tres]);
        $Treq->delete($trip);
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    $gallery = makeDict(array_slice($LABELS["galleries"], 1), array_merge([$Tres], array_slice($VALUES, -2, -1)));
    $Gres = $Greq->create($gallery);
    if (!$Gres) {
        $trip = makeDict(array_slice($LABELS["trips"], 0, 1), [$Tres]);
        $Treq->delete($trip);
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    echo makeResponse(200, "success", "Successfully Created.");
    exit();
}

if ($METHOD == "POST" && $_POST["action"] == "update") {
    $VALUES = [
        $_POST["id"], $_POST["title"], $_POST["description"], $_POST["destination"], $_POST["hotel"], $_POST["price"],
        $_POST["sits"], $_POST["date"], $_POST["time"]
    ];

    $trip = makeDict(
        array_merge(
            array_slice($LABELS["trips"], 0, 7),
            array_slice($LABELS["trips"], 8, 2)
        ),
        $VALUES
    );
    if (!checkEmpty($trip)) {
        echo makeResponse(400, "danger", "All Fields Required.");
        exit();
    }

    $Tres = $Treq->update($trip);
    if (!$Tres) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    if (isset($_POST["pickups"])) {
        $pickup = makeDict(array_slice($LABELS["pickups"], 1), [$_POST["id"], $_POST["pickups"]]);
        $Pres = $Preq->create($pickup);
    }
    if (isset($_FILES["images"])) {
        $gallery = makeDict(array_slice($LABELS["galleries"], 1), [$_POST["id"], $_FILES["images"]]);
        $Gres = $Greq->create($gallery);
    }

    echo makeResponse(200, "success", "Successfully Updated.");
    exit();
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "delete") {
    $VALUES = [$_POST["id"]];

    $trip = makeDict(array_slice($LABELS["trips"], 0, 1), $VALUES);
    $Tres = $Treq->delete($trip);
    if (!$Tres) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    echo makeResponse(200, "success", "Successfully Deleted.");
    exit();
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "status") {
    $Tres = $Treq->getAll();
    for ($i = 0; $i < count($Tres); $i++) {
        $date = date("Y-m-d", strtotime($Tres[$i]["date"]));
        if ($date <= date("Y-m-d")) {
            $trip = makeDict([":id", ":status"], [$Tres[$i]["id"], "0"]);
            $Treq->status($trip);
        } else {
            $trip = makeDict([":id", ":status"], [$Tres[$i]["id"], "1"]);
            $Treq->status($trip);
        }
    }
}