<?php
include_once('conexion.php');

class Galleries extends Conexion
{
    public function create($gallery)
    {
        for ($i = 0; $i < count($gallery[":image"]["name"]); $i++) {
            $name = makeFileName($gallery[":image"]["name"][$i]);
            $query = 'INSERT INTO galleries(trip, image) VALUES(:trip, :image)';
            $req = $this->cnx->prepare($query);
            $param = array(
                ":trip" => $gallery[":trip"],
                ":image" => $name
            );
            if ($req->execute($param)) {
                move_uploaded_file($gallery[":image"]["tmp_name"][$i], dirname(__DIR__) . "/static/storage/" . $name);
            } else {
                return false;
            }
        }
        return true;
    }

    public function delete($gallery)
    {
        $query = 'DELETE FROM galleries WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($gallery)) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteByTrip($gallery)
    {
        $query = 'DELETE FROM galleries WHERE trip = :trip';
        $req = $this->cnx->prepare($query);
        if ($req->execute($gallery)) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteImages($gallery)
    {
        unlink(dirname(__DIR__) . "/static/storage/" . $gallery);
    }

    public function getByTrip($gallery)
    {
        $query = 'SELECT * FROM galleries WHERE trip = :trip ORDER BY id DESC';
        $req = $this->cnx->prepare($query);
        if ($req->execute($gallery)) {
            return $req->fetchAll();
        } else {
            return false;
        }
    }

    public function getAll()
    {
        $query = 'SELECT * FROM galleries';
        $req = $this->cnx->prepare($query);
        if ($req->execute()) {
            return $req->fetchAll();
        } else {
            return false;
        }
    }
}


