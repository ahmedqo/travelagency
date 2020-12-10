<?php
ob_start();
include_once(dirname(__DIR__) . "/models/session.php");
include_once(dirname(__DIR__) . "/models/users.php");
include_once(dirname(__DIR__) . "/models/trips.php");
include_once(dirname(__DIR__) . "/models/pickups.php");
include_once(dirname(__DIR__) . "/models/reservations.php");
include_once(dirname(__DIR__) . "/controllers/utils.php");

$METHOD = $_SERVER["REQUEST_METHOD"];
$LABELS = [":id", ":user", ":trip", ":pickup", ":sits"];
$ses = new Session();
$Ureq = new Users();
$Treq = new Trips();
$Preq = new Pickups();
$Rreq = new Reservations();

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "getAll") {
    $Rres = $Rreq->getAll();
    echo json_encode($Rres);
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "get") {
    $VALUES = [$ses->get()["id"]];

    $reserv = makeDict(array_slice($LABELS, 1, 1), $VALUES);
    $Rres = $Rreq->getByUser($reserv);

    echo json_encode($Rres);
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "create") {
    $VALUES = [
        $ses->get()["id"], $_POST["trip"], $_POST["pickups"], $_POST["sit"]
    ];

    $reserv = makeDict(array_slice($LABELS, 1), $VALUES);
    if (!checkEmpty($reserv)) {
        echo makeResponse(400, "danger", "All Fields Required.");
        exit();
    }

    $trip = makeDict(array_slice($LABELS, 0, 1), array_slice($VALUES, 1, 1));
    $sits = $Treq->getSits($trip)[0];
    $reserved = $Treq->getReserved($trip)[0];
    $available = $sits - $reserved;
    if ($_POST["sit"] > $available) {
        echo makeResponse(401, "danger", "The Maximum Sits Available Is $available.");
        exit();
    }

    $Rres = $Rreq->create($reserv);
    if (!$Rres) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    $trip = makeDict([":id", ":reserved"], [$_POST["trip"], intval($_POST["sit"])]);
    $Tres = $Treq->grow($trip);

    $user = makeDict(array_slice($LABELS, 0, 1), array_slice($VALUES, 0, 1));
    $Ures = $Ureq->get($user);

    $message = sprintf(
        "Trip #%s successfully reserved. \n\nhttp://%s/#/m/trips/display/#%s",
        $_POST["trip"],
        $_SERVER["HTTP_HOST"],
        $_POST["trip"]
    );
    makeMail($Ures["email"], "Trip Reservation", $message);
    echo makeResponse(200, "success", "Successfully Reserved.");
    exit();
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "delete") {
    $VALUES = [
        $_POST["id"], $_POST["trip"], intval($_POST["sits"])
    ];

    $reserv = makeDict(array_slice($LABELS, 0, 1), array_slice($VALUES, 0, 1));
    $Rres = $Rreq->delete($reserv);
    if (!$Rres) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    $trip = makeDict([":id", ":reserved"], array_slice($VALUES, 1));
    $Treq->shrink($trip);

    echo makeResponse(200, "success", "Successfully Deleted.");
    exit();
}
