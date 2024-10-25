'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { gql } from 'graphql-request';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';
import { useSession } from 'next-auth/react';

export default function HistorialMedico() {
  const router = useRouter();
  const id = localStorage.getItem('pacienteID');
  const { data: session, status } = useSession();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatePage, setUpdatePage] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchHistorial();
    }
  }, [status, updatePage]);

  const fetchHistorial = async () => {
    const query = gql`
    query ListDetallePaciente {
        ListDetallePaciente(paciente_id: "${id}") {
            id
            title
            data_time
            notes
        }
    }
    `;

    setGraphQLClientHeaders({
      authorization: `Bearer ${session.accessToken}`,
    });

    try {
      const response = await graphQLClient.request(query);
      setHistorial(response.ListDetallePaciente);
    } catch (error) {
      console.error('Error al obtener el historial médico:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const queryDelete = `mutation DeleteStoryDetail {
        DeleteStoryDetail(id: "${id}")
    }`;
    try {
        const dataRes = await graphQLClient.request(queryDelete);
        setUpdatePage(!updatePage);
    }catch(error) {
        console.log(error)
    }
  }

  return (
    <div className="container">
      <h1>Historial Médico</h1>
      <button 
        className="btn btn-primary mb-3"
        onClick={() => router.push(`/home/manage-paciente/historial-clinico/create`)}
      >
        Nuevo Detalle de Historia
      </button>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha y Hora</th>
              <th>Notas</th>
              <th>Accion </th>
            </tr>
          </thead>
          <tbody>
            {historial.map((detalle) => (
              <tr key={detalle.id}>
                <td>{detalle.title}</td>
                <td>{new Date(detalle.data_time).toLocaleString()}</td>
                <td>{detalle.notes}</td>
                <td>
                    <div className='row'>
                        <div className='col'>
                            <button className='btn btn-danger' onClick={() => handleDelete(detalle.id)}> Eliminar </button>
                        </div>
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
