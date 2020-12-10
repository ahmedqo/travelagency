<?php
include_once(dirname(__DIR__) . "/models/session.php");
include_once(dirname(__DIR__) . "/models/users.php");

if(isset($_REQUEST["token"]) && strlen($_REQUEST["token"]) >= 32){    
    $TOKEN = hex2bin($_REQUEST["token"]);
    $user = new Users();
    $users = $user->getAll();
    foreach($users as $usr)
    {
       if($usr["token"] == $TOKEN)
       {
            if($usr["verified"] == 0)
            {
                $USR = array(":id" => $usr["id"], ":verified" => 1);
                $req = $user->updateVerified($USR);
                if($req){
                    echo "<h1>Account Verified Successfully.</h1>";
                    break;
                } else {
                    echo "<h1>Something Went Wrong.</h1>";
                    break;
                }
            }else{
                echo "<h1>Account Aleardy Verified.</h1>";
                break;
            }
       }
    }
} else {
    header("location:/");
}
