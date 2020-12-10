<?php
include_once('conexion.php');

class Reservations extends Conexion
{
    public function create($reservation)
    {
        $query = 'INSERT INTO reservations(user, trip, pickup, sits) VALUES(:user, :trip, :pickup, :sits)';
        $req = $this->cnx->prepare($query);
        if ($req->execute($reservation)) {
            return true;
        } else {
            return false;
        }
    }

    public function delete($reservation)
    {
        $query = 'DELETE FROM reservations WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($reservation)) {
            return true;
        } else {
            return false;
        }
    }

    public function getAll()
    {
        $query = 'SELECT u.username,t.id AS trip,t.date AS tripdate,t.title,t.price,p.location,r.id,r.sits,r.date from users u,trips t,pickups p,reservations r WHERE u.id =r.user AND t.id = r.trip AND p.id = r.pickup';
        $req = $this->cnx->prepare($query);
        if ($req->execute()) {
            return $req->fetchAll();
        } else {
            return false;
        }
    }

    public function get($reservation)
    {
        $query = 'SELECT * FROM reservations WHERE id = :id LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($reservation)) {
            return $req->fetch();
        } else {
            return false;
        }
    }

    public function getByUser($reservation)
    {
        $query = 'SELECT u.username,t.id AS trip,t.date AS tripdate,t.title,t.price,p.location,r.id,r.sits,r.date from users u,trips t,pickups p,reservations r WHERE u.id =r.user AND t.id = r.trip AND p.id = r.pickup AND r.user = :user';
        $req = $this->cnx->prepare($query);
        if ($req->execute($reservation)) {
            return $req->fetchAll();
        } else {
            return false;
        }
    }
}
