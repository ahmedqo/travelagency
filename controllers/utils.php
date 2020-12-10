<?php

use PHPMailer\PHPMailer\PHPMailer;

include_once(dirname(__DIR__) . "/models/PHPMailer/src/Exception.php");
include_once(dirname(__DIR__) . "/models/PHPMailer/src/PHPMailer.php");
include_once(dirname(__DIR__) . "/models/PHPMailer/src/SMTP.php");

function checkEmpty($dict)
{
    $valid = 1;
    foreach ($dict as $key => $val) {
        if (!isset($val) || $val == "" || $val == null) {
            $valid = 0;
        }
    }
    return $valid;
}

function makeResponse(int $status, string $type, string $message)
{
    $res = array(
        "status" => $status,
        "type" => $type,
        "message" => $message,
    );
    http_response_code($status);
    return json_encode($res);
}

function setPassword($pass)
{
    $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $salt = substr(str_shuffle($permitted_chars), 0, 10);
    $pass = $salt . $pass . $salt;
    return [md5($pass), $salt];
}

function getPassword($pass, $salt)
{
    $pass = $salt . $pass . $salt;
    return md5($pass);
}

function makeDict($labels, $values)
{
    if (count($labels) != count($values)) {
        return 0;
    }
    $dict = array();
    for ($i = 0; $i < count($labels); $i++) {
        $dict[$labels[$i]] = $values[$i];
    }
    return $dict;
}


function makeMail($TO, $SUB, $BODY)
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "contact.packngo@gmail.com";
    $mail->Password = "fskefvojwdynpkzl";
    $mail->SMTPSecure = "tls";
    $mail->Port = 587;
    $mail->setFrom("contact.packngo@gmail.com", "packngo");
    $mail->addAddress($TO, "Receiver");
    $mail->Subject = $SUB;
    $mail->Body    = $BODY;
    $mail->WordWrap = 50;
    $mail->isHTML(true);
    $mail->CharSet = "UTF-8";
    $mail->send();
}


function makeToken()
{
    return md5(implode("", setPassword(date("Y-m-d/h:i:sa"))));
}

function makePostRequest($url, $data){
    return file_get_contents($url, false, stream_context_create([
        'http' => [
            'method' => 'POST',
            'header'  => "Content-type: application/x-www-form-urlencoded",
            'content' => http_build_query($data)
        ]
    ]));
}

function makeFileName($file)
{
    $date = new DateTime();
    $file = explode(".", $file);
    $date =  $date->format('Y-m-d-H-i-s');
    $name = $date . "-" . $file[0] . "-";
    $name = md5($name) . "." . $file[1];
    return $name;
}