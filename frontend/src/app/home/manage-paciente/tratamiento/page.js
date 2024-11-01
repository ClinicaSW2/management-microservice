'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { gql } from 'graphql-request';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';
import { useSession } from 'next-auth/react';

export default function TratamientosPaciente() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pacienteID, setPacienteID] = useState(null); // Estado para el ID del paciente
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar pacienteID desde localStorage en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('tratPaciente');
      setPacienteID(id);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && pacienteID) {
      fetchTratamientos(session.accessToken);
    }
  }, [status, pacienteID]);

  const fetchTratamientos = async (token) => {
    setGraphQLClientHeaders({
      authorization: `Bearer ${token}`,
    });

    const query = gql`
    query GetTratamientoByIdPaciente {
        getTratamientoByIdPaciente(paciente_id: "${id}") {
            id
            detail
            title
            recipe
        }
    }
    
    `;
console.log(query)
    try {
      const response = await graphQLClient.request(query);
      setTratamientos(response.getTratamientoByIdPaciente);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando tratamientos...</p>;
  }
  const addNewTratamiento = () => {
    router.push("/home/manage-paciente/tratamiento/create")
  };

  const deleteTratamiento = (id) => {
    console.log(id)
  };

  return (
    <div className="container">
      <h1>Tratamientos del Paciente</h1>

      <div className="mb-4">
       
        <button className="btn btn-primary" onClick={addNewTratamiento}>Añadir nuevo tratamiento</button>
      </div>

      {tratamientos.length === 0 ? (
        <p>No se encontraron tratamientos.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Detalle</th>
              <th>Receta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tratamientos.map(tratamiento => (
              <tr key={tratamiento.id}>
                <td>{tratamiento.title}</td>
                <td>{tratamiento.detail}</td>
                <td>{tratamiento.recipe}</td>
                <td>
                   <div className="mb-4">
                     <button className="btn btn-danger mr-2" onClick={() => deleteTratamiento(tratamiento.id)}>Eliminar</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
