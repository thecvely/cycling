CREATE DATABASE CICLISMO;
CREATE USER 'mcorella'@'localhost' IDENTIFIED BY 'Ytjda3toGe'; 
GRANT ALL PRIVILEGES ON CICLISMO.* TO 'mcorella'@'localhost';


--Configurar Fichero /etc/plugins/emqx_auth_mysql.conf
/*
# etc/plugins/emqx_auth_mysql.conf

## server address
auth.mysql.server = 127.0.0.1:3306

## Connection pool size
auth.mysql.pool = 8

auth.mysql.username = mcorella

auth.mysql.password = Ytjda3toGe

auth.mysql.database = CICLISMO

auth.mysql.query_timeout = 5s

auth.mysql.password_hash = salt,sha256

auth.mysql.auth_query = select password,salt from mqtt_user where username = '%u' limit 1

*/
--ingresar con el usuario mcorella
--mysql -u mcorella -p

USE CICLISMO;

CREATE TABLE `mqtt_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `salt` varchar(35) DEFAULT NULL,
  `is_superuser` tinyint(1) DEFAULT 0,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mqtt_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `mqtt_user` ( `username`, `password`, `salt`)
VALUES
	('mcorella', '[saltpassword cifrado sha256]', NULL);






