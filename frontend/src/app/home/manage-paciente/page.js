'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagePaciente() {
  const router = useRouter();
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    const pacienteData = localStorage.getItem('pacienteData');
    if (pacienteData) {
      setPaciente(JSON.parse(pacienteData));
    } else {
      // Redirige a una página de error o lista de pacientes si no hay datos del paciente
      router.push('/home/manage-doctor');
    }
  }, []);

  if (!paciente) {
    return <p>Cargando...</p>;
  }

  const handleMostrarHistorial = () => {
    // Lógica para mostrar historial clínico
    localStorage.setItem("pacienteID", paciente.id)
    router.push(`/home/manage-paciente/historial-clinico`);
  };

  const handleNuevoTratamiento = () => {
    localStorage.setItem("tratPaciente", paciente.id)
    router.push(`/home/manage-paciente/tratamiento/`);
  };

  return (
    <div className="container">
      <h1>Detalles del Paciente</h1>
      <div className="mb-4">
        <h2>Información Personal</h2>
        <p><strong>Nombre:</strong> {paciente.name}</p>
        <p><strong>Apellido:</strong> {paciente.lastName}</p>
        <p><strong>Dirección:</strong> {paciente.address}</p>
        <p><strong>CI:</strong> {paciente.ci}</p>
        <p><strong>Sexo:</strong> {paciente.sexo}</p>
        <p><strong>Número de Contacto:</strong> {paciente.contactNumber}</p>
        <p><strong>Título:</strong> {paciente.titulo}</p>
        <p><strong>Email:</strong> {paciente.user.email}</p>
      </div>
      <div className="mb-4">
        <button className="btn btn-primary mr-2" onClick={handleMostrarHistorial}>Mostrar Historial Clínico</button>
        <button className="btn btn-secondary" onClick={handleNuevoTratamiento}>Tratamientos</button>
      </div>
    </div>
  );
}
