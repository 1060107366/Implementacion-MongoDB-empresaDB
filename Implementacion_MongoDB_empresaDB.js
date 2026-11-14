// ============================================================
// PROYECTO: IMPLEMENTACION DE BASES DE DATOS NoSQL
// BASE DE DATOS: empresaDB
// MOTOR: MongoDB - mongosh
// CONTENIDO: insercion, CRUD, filtros, JOIN y agregaciones
// ============================================================
//
// IMPORTANTE:
// Este script LIMPIA los documentos existentes en las colecciones
// clientes, productos e interacciones antes de cargar los datos.
// Ejecutarlo nuevamente reemplazara los datos de esas colecciones.
//
// EJECUCION:
// mongosh "mongodb://localhost:27017" --file "Implementacion_MongoDB_empresaDB.js"
// ============================================================

print("\n========== 1. SELECCION DE BASE DE DATOS ==========");
var dbEmpresa = db.getSiblingDB("empresaDB");

// Crear las colecciones si todavía no existen.
var colecciones = dbEmpresa.getCollectionNames();

if (!colecciones.includes("clientes")) {
    dbEmpresa.createCollection("clientes");
}
if (!colecciones.includes("productos")) {
    dbEmpresa.createCollection("productos");
}
if (!colecciones.includes("interacciones")) {
    dbEmpresa.createCollection("interacciones");
}

// Limpiar los documentos anteriores para evitar duplicados.
print("\n========== 2. PREPARAR COLECCIONES ==========");
dbEmpresa.clientes.deleteMany({});
dbEmpresa.productos.deleteMany({});
dbEmpresa.interacciones.deleteMany({});
print("Colecciones preparadas.");

// Crear índices únicos para identificación y código.
dbEmpresa.clientes.createIndex({ identificacion: 1 }, { unique: true });
dbEmpresa.productos.createIndex({ codigo: 1 }, { unique: true });

// ------------------------------------------------------------
// 3. INSERTAR 100 CLIENTES
// ------------------------------------------------------------
print("\n========== 3. INSERTAR CLIENTES ==========");

var clientes = [];

for (var i = 1; i <= 100; i++) {
    clientes.push({
        identificacion: "CLI" + String(i).padStart(3, "0"),
        nombre: "Cliente " + i,
        telefono: "300123" + String(i).padStart(4, "0"),
        correo: "cliente" + i + "@correo.com",
        direccion: "Barrio " + ((i % 5) + 1),
        ciudad: i % 2 === 0 ? "Santander de Quilichao" : "Caldono",
        fecha_registro: new Date(2026, 0, (i % 28) + 1),
        estado: i % 4 === 0 ? "Inactivo" : "Activo"
    });
}

var resultadoClientes = dbEmpresa.clientes.insertMany(clientes);
print("Clientes insertados: " + Object.keys(resultadoClientes.insertedIds).length);

// ------------------------------------------------------------
// 4. INSERTAR 20 PRODUCTOS
// ------------------------------------------------------------
print("\n========== 4. INSERTAR PRODUCTOS ==========");

var productos = [];

for (var j = 1; j <= 20; j++) {
    productos.push({
        codigo: "PROD" + String(j).padStart(3, "0"),
        nombre: "Producto " + j,
        categoria: j % 2 === 0 ? "Tecnologia" : "Accesorios",
        descripcion: "Producto de prueba para la empresa",
        precio: 50000 + (j * 25000),
        stock: 5 + (j * 2),
        proveedor: "Proveedor " + ((j % 4) + 1),
        estado: "Disponible",
        fecha_registro: new Date()
    });
}

var resultadoProductos = dbEmpresa.productos.insertMany(productos);
print("Productos insertados: " + Object.keys(resultadoProductos.insertedIds).length);

// ------------------------------------------------------------
// 5. INSERTAR 100 INTERACCIONES RELACIONADAS CON CLIENTES
// ------------------------------------------------------------
print("\n========== 5. INSERTAR INTERACCIONES ==========");

var listaClientes = dbEmpresa.clientes.find().sort({ identificacion: 1 }).toArray();
var interacciones = [];

for (var k = 0; k < 100; k++) {
    interacciones.push({
        cliente_id: listaClientes[k]._id,
        tipo: ["Llamada", "Mensaje", "Visita"][k % 3],
        fecha: new Date(2026, 9, (k % 28) + 1),
        descripcion: "Seguimiento comercial al cliente",
        resultado: k % 2 === 0 ? "Interesado" : "Pendiente",
        responsable: "Administrador",
        estado: "Finalizada"
    });
}

var resultadoInteracciones = dbEmpresa.interacciones.insertMany(interacciones);
print("Interacciones insertadas: " + Object.keys(resultadoInteracciones.insertedIds).length);

// ------------------------------------------------------------
// 6. OPERACIONES CRUD
// ------------------------------------------------------------
print("\n========== 6. OPERACIONES CRUD ==========");

// CREATE: insertar un cliente temporal para demostrar el registro.
print("\n--- CREATE: insertar cliente de prueba ---");
dbEmpresa.clientes.insertOne({
    identificacion: "TESTCRUD001",
    nombre: "Cliente Prueba CRUD",
    telefono: "3000000000",
    correo: "pruebacrud@correo.com",
    direccion: "Barrio de prueba",
    ciudad: "Santander de Quilichao",
    fecha_registro: new Date(),
    estado: "Activo"
});
printjson(dbEmpresa.clientes.findOne({ identificacion: "TESTCRUD001" }));

// READ: consultar el cliente temporal.
print("\n--- READ: consultar cliente de prueba ---");
printjson(dbEmpresa.clientes.findOne({ identificacion: "TESTCRUD001" }));

// UPDATE: actualizar teléfono y estado.
print("\n--- UPDATE: actualizar cliente de prueba ---");
dbEmpresa.clientes.updateOne(
    { identificacion: "TESTCRUD001" },
    { $set: { telefono: "3109876543", estado: "Inactivo" } }
);
printjson(dbEmpresa.clientes.findOne({ identificacion: "TESTCRUD001" }));

// DELETE: eliminar el cliente temporal y comprobar su eliminación.
print("\n--- DELETE: eliminar cliente de prueba ---");
dbEmpresa.clientes.deleteOne({ identificacion: "TESTCRUD001" });
print("Resultado después de eliminar (debe ser null):");
printjson(dbEmpresa.clientes.findOne({ identificacion: "TESTCRUD001" }));

// ------------------------------------------------------------
// 7. CONSULTAS, FILTROS Y OPERADORES
// ------------------------------------------------------------
print("\n========== 7. CONSULTAS Y FILTROS ==========");

print("\n--- Clientes activos ---");
printjson(dbEmpresa.clientes.find({ estado: "Activo" }).limit(5).toArray());

print("\n--- Clientes de Santander de Quilichao ---");
printjson(dbEmpresa.clientes.find({
    ciudad: "Santander de Quilichao"
}).limit(5).toArray());

print("\n--- Operador AND: activos de Santander de Quilichao ---");
printjson(dbEmpresa.clientes.find({
    $and: [
        { estado: "Activo" },
        { ciudad: "Santander de Quilichao" }
    ]
}).limit(5).toArray());

print("\n--- Operador OR: clientes de cualquiera de las dos ciudades ---");
printjson(dbEmpresa.clientes.find({
    $or: [
        { ciudad: "Santander de Quilichao" },
        { ciudad: "Caldono" }
    ]
}).limit(5).toArray());

print("\n--- Productos con precio mayor a 100000 ---");
printjson(dbEmpresa.productos.find({
    precio: { $gt: 100000 }
}).limit(5).toArray());

print("\n--- Productos entre 100000 y 300000 ---");
printjson(dbEmpresa.productos.find({
    precio: { $gte: 100000, $lte: 300000 }
}).toArray());

// ------------------------------------------------------------
// 8. JOIN CON $lookup
// ------------------------------------------------------------
print("\n========== 8. JOIN CON $lookup ==========");

var resultadoJoin = dbEmpresa.interacciones.aggregate([
    {
        $lookup: {
            from: "clientes",
            localField: "cliente_id",
            foreignField: "_id",
            as: "datos_cliente"
        }
    },
    { $unwind: "$datos_cliente" },
    {
        $project: {
            _id: 0,
            tipo: 1,
            fecha: 1,
            resultado: 1,
            nombre_cliente: "$datos_cliente.nombre",
            identificacion_cliente: "$datos_cliente.identificacion",
            ciudad_cliente: "$datos_cliente.ciudad"
        }
    },
    { $limit: 10 }
]).toArray();

printjson(resultadoJoin);

// ------------------------------------------------------------
// 9. AGREGACIONES ESTADISTICAS
// ------------------------------------------------------------
print("\n========== 9. AGREGACIONES ESTADISTICAS ==========");

// 9.1 Contar clientes por ciudad.
print("\n--- Total de clientes por ciudad ---");
printjson(dbEmpresa.clientes.aggregate([
    {
        $group: {
            _id: "$ciudad",
            total_clientes: { $sum: 1 }
        }
    },
    { $sort: { _id: 1 } }
]).toArray());

// 9.2 Calcular el precio promedio de los productos.
print("\n--- Precio promedio de productos ---");
printjson(dbEmpresa.productos.aggregate([
    {
        $group: {
            _id: null,
            precio_promedio: { $avg: "$precio" }
        }
    }
]).toArray());

// 9.3 Calcular el valor total del inventario.
print("\n--- Valor total del inventario ---");
printjson(dbEmpresa.productos.aggregate([
    {
        $group: {
            _id: null,
            valor_total_inventario: {
                $sum: {
                    $multiply: ["$precio", "$stock"]
                }
            }
        }
    }
]).toArray());

// 9.4 Contar interacciones por tipo.
print("\n--- Interacciones por tipo ---");
printjson(dbEmpresa.interacciones.aggregate([
    {
        $group: {
            _id: "$tipo",
            total_interacciones: { $sum: 1 }
        }
    },
    { $sort: { _id: 1 } }
]).toArray());

// 9.5 Contar clientes por ciudad y estado.
print("\n--- Clientes por ciudad y estado ---");
printjson(dbEmpresa.clientes.aggregate([
    {
        $group: {
            _id: {
                ciudad: "$ciudad",
                estado: "$estado"
            },
            total_clientes: { $sum: 1 }
        }
    },
    {
        $sort: {
            "_id.ciudad": 1,
            "_id.estado": 1
        }
    }
]).toArray());

// ------------------------------------------------------------
// 10. VERIFICACION FINAL
// ------------------------------------------------------------
print("\n========== 10. VERIFICACION FINAL ==========");
print("Total de clientes: " + dbEmpresa.clientes.countDocuments());
print("Total de productos: " + dbEmpresa.productos.countDocuments());
print("Total de interacciones: " + dbEmpresa.interacciones.countDocuments());
print("Total de documentos: " + (
    dbEmpresa.clientes.countDocuments() +
    dbEmpresa.productos.countDocuments() +
    dbEmpresa.interacciones.countDocuments()
));

print("\n========== PROCESO FINALIZADO ==========");
