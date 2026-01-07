document.addEventListener('DOMContentLoaded', () => {

  const menu = document.getElementById('menu-section');
  const appSection = document.getElementById('app-section');

  const btnCrear = document.getElementById('btnCrear');
  const btnVer = document.getElementById('btnVer');
  const btnVolverForm = document.getElementById('btnVolverForm');
  const btnVolverTabla = document.getElementById('btnVolverTabla');

  const citaForm = document.getElementById('citaForm');
  const tablaCitas = document.querySelector('#tablaCitas tbody');
  const vacioFila = document.getElementById('vacio');

  // BOTONES MENU
  btnCrear.addEventListener('click', () => {
    menu.classList.add('hidden');
    appSection.classList.remove('hidden');
  });

  btnVer.addEventListener('click', () => {
    menu.classList.add('hidden');
    appSection.classList.remove('hidden');
    mostrarCitas();
  });

  btnVolverForm.addEventListener('click', volverMenu);
  btnVolverTabla.addEventListener('click', volverMenu);

  function volverMenu() {
    appSection.classList.add('hidden');
    menu.classList.remove('hidden');
    citaForm.reset();
    limpiarErrores();
    document.getElementById('citaId').value = '';
  }

  // CLASE CITA
  class Cita {
    constructor(nombre, apellidos, dni, telefono, fechaNacimiento, fechaCita, horaCita, observaciones) {
      this.id = Date.now();
      this.nombre = nombre;
      this.apellidos = apellidos;
      this.dni = dni;
      this.telefono = telefono;
      this.fechaNacimiento = fechaNacimiento;
      this.fechaCita = fechaCita;
      this.horaCita = horaCita;
      this.observaciones = observaciones;
    }
  }

  // LOCALSTORAGE
  function cargarCitas() {
    return JSON.parse(localStorage.getItem('citas')) || [];
  }

  function guardarCitas(citas) {
    localStorage.setItem('citas', JSON.stringify(citas));
  }

  // MOSTRAR CITAS
  function mostrarCitas() {
    const citas = cargarCitas();
    tablaCitas.innerHTML = '';

    if (citas.length === 0) {
      tablaCitas.appendChild(vacioFila);
      return;
    }

    citas.forEach((cita, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${cita.nombre}</td>
        <td>${cita.apellidos}</td>
        <td>${cita.dni}</td>
        <td>${cita.telefono}</td>
        <td>${cita.fechaNacimiento}</td>
        <td>${cita.fechaCita} ${cita.horaCita}</td>
        <td>${cita.observaciones}</td>
        <td>
          <button onclick="editarCita(${cita.id})">Editar</button>
          <button onclick="eliminarCita(${cita.id})">Eliminar</button>
        </td>
      `;
      tablaCitas.appendChild(tr);
    });
  }

  // ERRORES
  function limpiarErrores() {
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
  }

function validar(cita) {
  limpiarErrores();
  let ok = true;

  // Nombre obligatorio
  if (!cita.nombre.trim()) {
    errorNombre.textContent = 'Nombre obligatorio';
    ok = false;
  }

  // DNI: 8 números + letra
  if (!/^\d{8}[A-Za-z]$/.test(cita.dni)) {
    errorDni.textContent = 'DNI incorrecto (8 números y letra)';
    ok = false;
  }

  // Teléfono: 9 números
  if (!/^\d{9}$/.test(cita.telefono)) {
    errorTelefono.textContent = 'Teléfono incorrecto (9 números)';
    ok = false;
  }

  return ok;
}

  // SUBMIT FORM
  citaForm.addEventListener('submit', e => {
    e.preventDefault();

    const nueva = new Cita(
      nombre.value,
      apellidos.value,
      dni.value,
      telefono.value,
      fechaNacimiento.value,
      fechaCita.value,
      horaCita.value,
      observaciones.value
    );

    if (!validar(nueva)) return;

    const citas = cargarCitas();
    const id = citaId.value;

    if (id) {
      const i = citas.findIndex(c => c.id == id);
      citas[i] = { ...nueva, id: Number(id) };
    } else {
      citas.push(nueva);
    }

    guardarCitas(citas);
    mostrarCitas();
    citaForm.reset();
    citaId.value = '';
  });

  // HACER FUNCIONES GLOBALES
  window.editarCita = function(id) {
    const cita = cargarCitas().find(c => c.id == id);
    nombre.value = cita.nombre;
    apellidos.value = cita.apellidos;
    dni.value = cita.dni;
    telefono.value = cita.telefono;
    fechaNacimiento.value = cita.fechaNacimiento;
    fechaCita.value = cita.fechaCita;
    horaCita.value = cita.horaCita;
    observaciones.value = cita.observaciones;
    citaId.value = cita.id;
  };

  window.eliminarCita = function(id) {
    guardarCitas(cargarCitas().filter(c => c.id != id));
    mostrarCitas();
  };

});
