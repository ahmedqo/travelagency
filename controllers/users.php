<?php
ob_start();
include_once(dirname(__DIR__) . "/models/session.php");
include_once(dirname(__DIR__) . "/models/users.php");
include_once(dirname(__DIR__) . "/controllers/utils.php");

$METHOD = $_SERVER["REQUEST_METHOD"];
$LABELS = [
    ":id", ":firstname", ":lastname", ":username", ":password", ":salt", ":cin", ":phone",
    ":email", ":address", ":city", ":country", ":type", ":status", ":token", ":verified"
];
$ses = new Session();
$req = new Users();

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "getAll") {
    $res = $req->getAll();
    echo json_encode($res);
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "get") {
    $user = makeDict(array_slice($LABELS, 0, 1), [$_POST["id"]]);
    $user = $req->get($user);
    echo json_encode($user);
}

if ($METHOD == "POST" && $_POST["action"] == "create") {
    if (!isset($_POST["type"])) {
        $_POST["type"] = "-1";
    }
    $PASS = setPassword($_POST["password"]);
    $TOKEN = makeToken();
    $VALUES = [
        $_POST["firstname"], $_POST["lastname"], $_POST["username"], $PASS[0], $PASS[1], $_POST["cin"], $_POST["phone"],
        $_POST["email"], $_POST["address"], $_POST["city"], $_POST["country"], $_POST["type"], "1", $TOKEN, "0"
    ];

    $user = makeDict(array_slice($LABELS, 1), $VALUES);
    if (!checkEmpty($user)) {
        echo makeResponse(400, "danger", "All Fields Required.");
        exit();
    }

    $user = makeDict(array_slice($LABELS, 3, 1), array_slice($VALUES, 2, 1));
    $res = $req->checkUsername($user);
    if ($res) {
        echo makeResponse(409, "danger", "Username Already In Use.");
        exit();
    }

    $user = makeDict(array_slice($LABELS, 8, 1), array_slice($VALUES, 7, 1));
    $res = $req->checkEmail($user);
    if ($res) {
        echo makeResponse(409, "danger", "Email Already In Use.");
        exit();
    }

    $user = makeDict(array_slice($LABELS, 1), $VALUES);
    $res = $req->create($user);
    if (!$res) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    $message = sprintf(
        "thank you for sign up in Tripia. please verify your account at http://%s/verify/?token=%s",
        $_SERVER["HTTP_HOST"],
        bin2hex($TOKEN)
    );
    makeMail($_POST["email"], "Account Creation", $message);
    echo makeResponse(200, "success", "Successfully Created. Please Verify Your Email.");
    exit();
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "update") {
    if (!isset($_POST["id"])) {
        $_POST["id"] = $ses->get()["id"];
    }

    if (!isset($_POST["type"])) {
        $_POST["type"] = $ses->get()["type"];
    }

    $VALUES = [
        $_POST["id"], $_POST["firstname"], $_POST["lastname"], $_POST["username"], $_POST["cin"], $_POST["phone"],
        $_POST["email"], $_POST["address"], $_POST["city"], $_POST["country"], $_POST["type"]
    ];

    $user  = makeDict(array_merge(array_slice($LABELS, 0, 4), array_slice($LABELS, 6, 7)), $VALUES);
    if (!checkEmpty($user)) {
        echo makeResponse(400, "danger", "All Fields Required.");
        exit();
    }

    $user = makeDict(
        array_merge(array_slice($LABELS, 0, 1), array_slice($LABELS, 3, 1)),
        array_merge(array_slice($VALUES, 0, 1), array_slice($VALUES, 3, 1))
    );
    $res = $req->checkUsernameUpdate($user);
    if ($res) {
        echo makeResponse(409, "danger", "Username Already In Use.");
        exit();
    }

    $user = makeDict(
        array_merge(array_slice($LABELS, 0, 1), array_slice($LABELS, 8, 1)),
        array_merge(array_slice($VALUES, 0, 1), array_slice($VALUES, 5, 1))
    );
    $res = $req->checkEmailUpdate($user);
    if ($res) {
        echo makeResponse(409, "danger", "Email Already In Use.");
        exit();
    }

    $user  = makeDict(array_merge(array_slice($LABELS, 0, 4), array_slice($LABELS, 6, 7)), $VALUES);
    $res = $req->update($user);
    if (!$res) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    echo makeResponse(200, "success", "Successfully Updated.");
    exit();
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "delete") {
    $VALUES = [$_POST["id"]];

    $user = makeDict(array_slice($LABELS, 0, 1), $VALUES);
    $res = $req->delete($user);
    if (!$res) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    echo makeResponse(200, "success", "Successfully Deleted.");
    exit();
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "updatePassword") {
    $VALUES = [$_POST["oldPassword"], $_POST["password"]];

    $user = makeDict(["oldPassword", "password"], $VALUES);
    if (!checkEmpty($user)) {
        echo makeResponse(400, "danger", "All Fields Required.");
        exit();
    }

    $data[0] = $ses->get()["username"];
    $user = makeDict(["username"], $data);
    $salt = $req->salt($user);
    $pass = $req->password($user);
    $password = getPassword($_POST["oldPassword"], $salt);
    if ($password != $pass) {
        echo makeResponse(401, "danger", "Old Password Incorrect.");
        exit();
    }

    $data[0] = $ses->get()["id"];
    $gen = setPassword($_POST["password"]);
    $user = makeDict([":id", ":password", ":salt"], array_merge($data, $gen));
    $res = $req->updatePassword($user);
    if (!$res) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    echo makeResponse(200, "success", "Successfully Updated.");
    exit();
}

if ($METHOD == "POST" && $ses->get() && $_POST["action"] == "updateStatus") {
    $VALUES = [$_POST["id"], $_POST["status"]];

    $user = makeDict(
        array_merge(array_slice($LABELS, 0, 1), array_slice($LABELS, -3, 1)),
        $VALUES
    );
    $res = $req->updateStatus($user);
    if (!$res) {
        echo makeResponse(500, "danger", "Somthing Went Wrong.");
        exit();
    }

    echo makeResponse(200, "success", "Successfully Updated.");
    exit();
}

if ($METHOD == "POST" && $_POST["action"] == "login") {
    $VALUES = [$_POST["username"], $_POST["password"]];

    $user = makeDict(array_slice($LABELS, 3, 2), $VALUES);
    if (!checkEmpty($user)) {
        echo makeResponse(400, "danger", "All Fields Required.");
        exit();
    }

    $user = makeDict(array_slice($LABELS, 3, 1), array_slice($VALUES, 0, 1));
    $res = $req->username($user);
    if (!$res) {
        echo makeResponse(404, "danger", "Username Not Found.");
        exit();
    }

    $salt = $req->salt($user);
    $pass = $req->password($user);
    $password = getPassword($_POST["password"], $salt);
    if ($password != $pass) {
        echo makeResponse(401, "danger", "Password Incorrect.");
        exit();
    }

    $user = makeDict(array_slice($LABELS, 3, 1), array_slice($VALUES, 0, 1));
    $id = $req->id($user);

    $user = makeDict(array_slice($LABELS, 0, 1), [$id]);
    $res = $req->status($user);
    if (!$res) {
        echo makeResponse(403, "danger", "Account Blocked.");
        exit();
    }

    $res = $req->verified($user);
    if (!$res) {
        echo makeResponse(401, "danger", "Verify Your Email.");
        exit();
    }

    $type = $req->type($user);

    $user = makeDict(["id", "username", "type"], [$id, $_POST["username"], $type]);
    $ses->set($user);
    echo makeResponse(200, "success", "Successfully Loged In.");
    exit();
}
