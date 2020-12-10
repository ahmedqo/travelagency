<?php
class Conexion
{
    private $host = "localhost";
    private $db_name = "travelagency";
    private $username = "root";
    private $password = "";
    public $cnx;
    public function __construct()
    {
        try {
            $this->cnx =  new PDO("mysql:host={$this->host};dbname={$this->db_name}", $this->username, $this->password);
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
    }
}
