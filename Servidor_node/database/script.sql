
CREATE TABLE placas (
  id INT(11) auto_increment NOT NULL, 
  PRIMARY KEY (id),
  nombre VARCHAR(10),
  tipo boolean NOT NULL,
);

/* CREATE TABLE placas (
  id INT(11) auto_increment NOT NULL, 
  PRIMARY KEY (id),
  llave VARCHAR(30),
  filas INT(11),
  columnas INT(11),
  width INT(11),
  height INT(11),
  imagen VARCHAR(30)
);

CREATE TABLE piezas (
  id INT(11) auto_increment NOT NULL, 
  PRIMARY KEY (id),
  color VARCHAR(50) NOT NULL,
  posicion VARCHAR(30),
  x INT(11) NOT NULL,
  y INT(11) NOT NULL,
  estado boolean,
  sala_id int(11), 
  FOREIGN KEY(sala_id) REFERENCES salas (id)
);

CREATE TABLE users_salas(
   id INT(11) auto_increment NOT NULL, 
  PRIMARY KEY (id),
  user_id int(11), 
  FOREIGN KEY(user_id) REFERENCES users (id),
  sala_id int(11), 
  FOREIGN KEY(sala_id) REFERENCES salas (id),
  puntos int(11)
); */