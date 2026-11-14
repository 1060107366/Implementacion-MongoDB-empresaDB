# Implementación MongoDB - empresaDB

**Tarea 4 - Almacenamiento y Consultas de Datos en Big Data**  
Proyecto desarrollado para la gestión de información comercial de una pequeña o mediana empresa (MiPyME) mediante una base de datos NoSQL orientada a documentos en MongoDB.

* **Autor:** Danny Alejandro Velasco
* **Programa:** Ingeniería de Sistemas
* **Institución:** Universidad Nacional Abierta y a Distancia (UNAD)

---

##  Descripción del caso de uso
Se diseñó e implementó la base de datos **`empresaDB`** utilizando **MongoDB Shell (`mongosh`)** y **MongoDB Compass** (conexión local `db_fase4`). El conjunto de datos de prueba consta de **220 documentos** distribuidos en tres colecciones principales:

1. **`clientes` (100 documentos):** Registra identificación, nombre, teléfono, correo electrónico, dirección, ciudad (`Caldono` y `Santander de Quilichao`), fecha de registro y estado (`Activo` / `Inactivo`).
2. **`productos` (20 documentos):** Almacena código, nombre, categoría (`Tecnologia` y `Accesorios`), descripción, precio, stock disponible, proveedor, estado y fecha de registro.
3. **`interacciones` (100 documentos):** Documenta actividades de seguimiento comercial (`Llamada`, `Mensaje`, `Visita`), fecha, descripción, resultado, responsable, estado y referencia al cliente mediante `cliente_id`.

---

##  Funcionalidades implementadas
* **Inserción masiva:** Población inicial de las tres colecciones mediante ciclos en JavaScript y el método `insertMany()`.
* **Operaciones CRUD:** Creación (`insertOne`), lectura (`find`, `findOne`), actualización (`updateOne` con `$set`) y eliminación (`deleteOne`) de registros de prueba.
* **Consultas con filtros y operadores:** Búsquedas condicionales utilizando operadores lógicos y de comparación (`$and`, `$or`, `$gt`, `$gte`, `$lte`).
* **Relación entre colecciones:** Asociación de `interacciones` con los datos de `clientes` mediante etapas de agregación `$lookup`, `$unwind` y `$project`.
* **Consultas de agregación estadística:** Uso de `$group`, `$sum`, `$avg`, `$multiply` y `$sort` para obtener métricas clave:
  * Distribución de clientes por ciudad y estado.
  * Precio promedio de los productos ($312.500).
  * Valor total del inventario ($195.750.000).
  * Conteo de interacciones por tipo.

---

##  Estructura del repositorio
* `README.md`: Documentación general y descripción del proyecto.
* `Implementacion_MongoDB_empresaDB.js`: Script completo con la creación de colecciones, carga de los 220 documentos, pruebas CRUD, filtros, `$lookup` y agregaciones.
* `Instrucciones_Ejecucion_MongoDB.txt`: Guía paso a paso para importar y ejecutar el script en el entorno local de MongoDB.

