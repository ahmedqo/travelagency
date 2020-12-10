<?php
include_once('conexion.php');

class Users extends Conexion
{
    public function create($user)
    {
        $query = 'INSERT INTO users(firstname, lastname, username, password, salt, phone, email, cin, address, city, country, type, status, token, verified) VALUES(:firstname, :lastname, :username, :password, :salt, :phone, :email, :cin, :address, :city, :country, :type, :status, :token, :verified)';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return true;
        } else {
            return false;
        }
    }

    public function update($user)
    {
        $query = 'UPDATE users SET firstname = :firstname, lastname = :lastname, username = :username, phone = :phone, email = :email, cin = :cin, address = :address, city = :city, country = :country, type = :type WHERE id = :id ';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return true;
        } else {
            return false;
        }
    }

    public function delete($user)
    {
        $query = 'DELETE FROM users WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return true;
        } else {
            return false;
        }
    }

    public function getAll()
    {
        $query = 'SELECT * FROM users ORDER BY id DESC';
        $req = $this->cnx->prepare($query);
        if ($req->execute()) {
            return $req->fetchAll();
        } else {
            return false;
        }
    }

    public function get($user)
    {
        $query = 'SELECT * FROM users WHERE id = :id LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return $req->fetch();
        } else {
            return false;
        }
    }

    public function username($user)
    {
        $query = 'SELECT username FROM users WHERE username = :username LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            if ($req->rowCount()) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function id($user)
    {
        $query = 'SELECT id FROM users WHERE username = :username LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return $req->fetch()[0];
        } else {
            return false;
        }
    }

    public function salt($user)
    {
        $query = 'SELECT salt FROM users WHERE username = :username LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return $req->fetch()[0];
        } else {
            return false;
        }
    }

    public function password($user)
    {
        $query = 'SELECT password FROM users WHERE username = :username LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return $req->fetch()[0];
        } else {
            return false;
        }
    }

    public function type($user)
    {
        $query = 'SELECT type FROM users WHERE id = :id LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return $req->fetch()[0];
        } else {
            return false;
        }
    }

    public function status($user)
    {
        $query = 'SELECT status FROM users WHERE id = :id LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return $req->fetch()[0];
        } else {
            return false;
        }
    }

    public function verified($user)
    {
        $query = 'SELECT verified FROM users WHERE id = :id LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return $req->fetch()[0];
        } else {
            return false;
        }
    }

    public function checkUsername($user)
    {
        $query = 'SELECT username FROM users WHERE username = :username LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            if ($req->rowCount()) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function checkEmail($user)
    {
        $query = 'SELECT email FROM users WHERE email = :email LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            if ($req->rowCount()) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function checkUsernameUpdate($user)
    {
        $query = 'SELECT username FROM users WHERE username = :username AND id != :id LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            if ($req->rowCount()) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function checkEmailUpdate($user)
    {
        $query = 'SELECT email FROM users WHERE email = :email AND id != :id LIMIT 1';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            if ($req->rowCount()) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function updatePassword($user)
    {
        $query = 'UPDATE users SET password = :password, salt = :salt WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return true;
        } else {
            return false;
        }
    }

    public function updateStatus($user)
    {
        $query = 'UPDATE users SET status = :status WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return true;
        } else {
            return false;
        }
    }

    public function updateVerified($user)
    {
        $query = 'UPDATE users SET verified = :verified WHERE id = :id';
        $req = $this->cnx->prepare($query);
        if ($req->execute($user)) {
            return true;
        } else {
            return false;
        }
    }
}
