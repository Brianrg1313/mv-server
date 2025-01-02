CREATE DATABASE `MV_app`;
CREATE DATABASE `MV_control`;
CREATE DATABASE `MV_pacientes`;
CREATE DATABASE `MV_sesiones`;
GRANT SELECT, INSERT, UPDATE, DELETE, DROP, ALTER ON `MV\_app`.* TO 'clientes'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, DROP, ALTER ON `MV\_control`.* TO 'clientes'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, DROP, ALTER ON `MV\_pacientes`.* TO 'clientes'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, DROP, ALTER ON `MV\_sesiones`.* TO 'clientes'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, DROP, ALTER ON `MV\_administradores`.* TO 'clientes'@'%';

mongoexport --uri="mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/" --collection=MV_pacientes  --out=MV_pacientes.json

mongodump --uri="mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/MV_pacientes"
mongodump --uri "mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/MV_pacientes" --authenticationMechanism MONGODB-CR