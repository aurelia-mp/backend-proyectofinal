import axios from 'axios';

// PRUEBAS CON AXIOS: 

// 1. LISTAR PRODUCTOS

axios.get('http://localhost:8090/api/productos/')
  .then(response => {
    let docs = response.data
    console.log(docs);
  })
  .catch(error => {
    console.log(error)
  })
  .then(()=>{
    console.log(`Request finalizado`)
  });

// 2. POST PRODUCTO
const nuevoVino = {
    nombre: "Vino de prueba desde Axios",
    descripcion: "Prueba",
    codigo: 123456,
    precio: 1000,
    thumbnail: "upload/item1.jpg",
    stock: 100
}

axios.post('http://localhost:8090/api/productos/', nuevoVino)
    .then(response => {
        let docs = response.data
        console.log(docs);
    })
    .catch(error => {
        console.log(error)
    })
    .then(()=>{
        console.log(`Request finalizado`)
    });


// 3. MODIFICACIÓN PRODUCTOS (PUT)
const vinoModificado={
    // Se modifica el nombre y precio de un ítem
    nombre:"Luigi Bosca S.Blanc",
    precio: 1
}
axios.put('http://localhost:8090/api/productos/producto/63a9c8e069393930a6a47027', vinoModificado)
    .then(response => {
        let docs = response.data
        console.log(docs);
    })
    .catch(error => {
        console.log(error)
    })
    .then(()=>{
        console.log(`Request finalizado`)
    });


// 4. Borrar producto
axios.delete('http://localhost:8090/api/productos/producto/642712b0bdf37986f9e145f0')
    .then(response => {
        let docs = response.data
        console.log(docs);
    })
    .catch(error => {
        console.log(error)
    })
    .then(()=>{
        console.log(`Request finalizado`)
    });
