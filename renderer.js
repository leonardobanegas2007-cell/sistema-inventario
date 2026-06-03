const codigo = document.getElementById('codigo');
const producto = document.getElementById('producto');
const cantidad = document.getElementById('cantidad');
const precio = document.getElementById('precio');
const categoria = document.getElementById('categoria');

const btnGuardar = document.getElementById('btnGuardar');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnReporte = document.getElementById('btnReporte');

const tablaProductos = document.getElementById('tablaProductos');
const totalInventario = document.getElementById('totalInventario');

let productos = [];
let indiceEditar = null;

btnLimpiar.addEventListener('click', limpiarFormulario);

btnGuardar.addEventListener('click', function () {

    if (
        codigo.value == '' ||
        producto.value == '' ||
        cantidad.value == '' ||
        precio.value == '' ||
        categoria.value == ''
    ) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (Number(precio.value) <= 0 || Number(cantidad.value) <= 0) {
        alert("El precio y la cantidad deben ser mayores a cero.");
        return;
    }

    let nuevoProducto = {
        codigo: codigo.value,
        producto: producto.value,
        cantidad: Number(cantidad.value),
        precio: Number(precio.value),
        categoria: categoria.value
    };

    if (indiceEditar === null) {
        productos.push(nuevoProducto);
    } else {
        productos[indiceEditar] = nuevoProducto;
        indiceEditar = null;
        btnGuardar.textContent = "Guardar producto";
    }

    mostrarProductos();
    limpiarFormulario();
});

function mostrarProductos() {
    tablaProductos.innerHTML = "";
    let sumaInventario = 0;

    productos.forEach(function (item, index) {

        let totalProducto = item.precio * item.cantidad;
        sumaInventario += totalProducto;

        let fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.codigo}</td>
            <td>${item.producto}</td>
            <td>${item.categoria}</td>
            <td>${item.precio.toFixed(2)}</td>
            <td>${item.cantidad}</td>
            <td>${totalProducto.toFixed(2)}</td>
            <td>
                <button onclick="editarProducto(${index})">Editar</button>
                <button onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;

        tablaProductos.appendChild(fila);
    });

    totalInventario.textContent = sumaInventario.toFixed(2);
}

function editarProducto(index) {
    let item = productos[index];

    codigo.value = item.codigo;
    producto.value = item.producto;
    categoria.value = item.categoria;
    precio.value = item.precio;
    cantidad.value = item.cantidad;

    indiceEditar = index;
    btnGuardar.textContent = "Actualizar producto";
}

function eliminarProducto(index) {
    if (confirm("¿Está seguro de eliminar este producto?")) {
        productos.splice(index, 1);
        mostrarProductos();
    }
}

function limpiarFormulario() {
    codigo.value = '';
    producto.value = '';
    categoria.value = '';
    precio.value = '';
    cantidad.value = '';

    indiceEditar = null;
    btnGuardar.textContent = "Guardar producto";
}

btnReporte.addEventListener('click', function () {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("REPORTE DE INVENTARIO", 10, 10);

    let y = 20;

    productos.forEach((item, index) => {
        let total = item.precio * item.cantidad;

        doc.text(
            `${index + 1}. ${item.codigo} - ${item.producto} - ${item.cantidad} x ${item.precio} = ${total.toFixed(2)}`,
            10,
            y
        );

        y += 10;
    });

    doc.text(`TOTAL INVENTARIO: ${totalInventario.textContent}`, 10, y + 10);

    doc.save("reporte_inventario.pdf");
});