<?php
include_once('conexion.php');

class Trips extends Conexion
{
    public function create($trip)
    {
        $query = 'INSERT INTO trips(title, description, destination, hotel, price, sits, reserved, date, time, status) VALUES(:title, :description, :destination, :hotel, :price, :sits, :reserved, :date, :time, :status)';
        $req = $this->cnx->prepare($query);
        if ($req->execute($trip)) {
            return $this->cnx->lastInsertId();
        } else {
            return false;
        }
    }

    public function update($trip)
    {
        $query = 'UPDATE trips SET title = :title, description = :description, destination = :destination, hotel = :hotel, price = :price, sits = :sits, date = :date, time = :time WHERE id = :id ';
        $req = $this->cnx->prepare($query);
        if ($req->execute($trip)) {
            return true;
        } else {
            return false;
        }
    }

    public function delete($trip)
    {
        $query = 'DELETE FROM trips WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($trip)) {
            return true;
        } else {
            print_r($this->cnx->errorInfo());
            return false;
        }
    }

    public function getAll()
    {
        $query = 'SELECT * FROM trips ORDER BY id DESC';
        $req = $this->cnx->prepare($query);
        if ($req->execute()) {
            return $req->fetchAll();
        } else {
            return false;
        }
    }

    public function get($trip)
    {
        $query = 'SELECT * FROM trips WHERE id = :id LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($trip)) {
            return $req->fetch();
        } else {
            return false;
        }
    }

    public function getSits($trip)
    {
        $query = 'SELECT sits FROM trips WHERE id = :id LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($trip)) {
            return $req->fetch();
        } else {
            return false;
        }
    }

    public function getReserved($trip)
    {
        $query = 'SELECT reserved FROM trips WHERE id = :id LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($trip)) {
            return $req->fetch();
        } else {
            return false;
        }
    }

    public function grow($trip)
    {
        $query = 'UPDATE trips SET reserved = reserved + :reserved WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($trip)) {
            return true;
        } else {
            return false;
        }
    }

    public function shrink($trip)
    {
        $query = 'UPDATE trips SET reserved = reserved - :reserved WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($trip)) {
            return true;
        } else {
            return false;
        }
    }

    public function status($trip){
        $query = 'UPDATE trips SET status = :status WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($trip)) {
            return true;
        } else {
            return false;
        }
    }
}
