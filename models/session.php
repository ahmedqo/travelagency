<?php
session_start();

class Session
{
    public function set($session)
    {
        foreach ($session as $key => $val) {
            $_SESSION['USER'][$key] = $val;
        }
    }

    public function get()
    {
        if (isset($_SESSION['USER'])) return $_SESSION['USER'];
        else return false;
    }

    public function exist()
    {
        if (isset($_SESSION['USER'])) return true;
        else return false;
    }

    public function clear()
    {
        session_unset();
        session_destroy();
        $_SESSION = array();
    }
}
