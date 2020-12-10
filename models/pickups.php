<?php
include_once('conexion.php');

class Pickups extends Conexion
{
    public function create($pickup)
    {
        for ($i = 0; $i < count($pickup[":location"]); $i++) {
            $query = 'INSERT INTO pickups(trip, location) VALUES(:trip, :location)';
            $req = $this->cnx->prepare($query);
            $param = array(
                ":trip" => $pickup[":trip"],
                ":location" => $pickup[":location"][$i]
            );
            if (!$req->execute($param)) {
                return false;
            }
        }
        return true;
    }

    public function delete($pickup)
    {
        $query = 'DELETE FROM pickups WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($pickup)) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteByTrip($pickup)
    {
        $query = 'DELETE FROM pickups WHERE trip = :trip';
        $req = $this->cnx->prepare($query);
        if ($req->execute($pickup)) {
            return true;
        } else {
            return false;
        }
    }

    public function get($pickup)
    {
        $query = 'SELECT * FROM pickups WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($pickup)) {
            return $req->fetch();
        } else {
            return false;
        }
    }

    public function getByTrip($pickup)
    {
        $query = 'SELECT * FROM pickups WHERE trip = :trip ORDER BY id DESC';
        $req = $this->cnx->prepare($query);
        if ($req->execute($pickup)) {
            return $req->fetchAll();
        } else {
            return false;
        }
    }
}
