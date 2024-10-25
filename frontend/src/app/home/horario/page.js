"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';
import ConfirmModal from '@/components/confirm-modal';

export default function HorariosDoctor() {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [refreshPage, setRefreshPage] = useState(true);

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        if (sessionStatus === 'authenticated') {
          const token = sessionData.accessToken;

          setGraphQLClientHeaders({
            authorization: `Bearer ${token}`,
          });

          const query = `
            query MiHorario {
              miHorario {
                status
                message
                data {
                  id
                  date
                  time
                }
              }
            }
          `;

          const { miHorario } = await graphQLClient.request(query);
          if (miHorario && miHorario.status === 200) {
            setHorarios(miHorario.data);
          }
        }
      } catch (error) {
        console.error('Error fetching horarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHorarios();
  }, [sessionStatus, sessionData, refreshPage]);

  const handleEliminarHorario = (id) => {
    setSelectedHorario(id);
    showModal();
  };

  const showModal = (newValue = true) => {
    setModalVisibility(newValue);
  };

  const onCancel = () => {
    setSelectedHorario(null);
    showModal(false);
  };

  const onConfirm = async () => {
    try {
      const deleteQuery =`
      mutation DeleteHorario {
        deleteHorario(id: "${selectedHorario}")
    }    
      `;
      const data = await graphQLClient.request(deleteQuery);
      console.log(data)
      setRefreshPage(!refreshPage)
      showModal(false);
    } catch (error) {
      console.error('Error deleting horario:', error);
      showModal(false);
    }
  };

  return (
    <div className="container">
      <h1>Horarios Disponibles del Doctor</h1>

      <Link
              href="/home/horario/create"
              className="btn btn-primary btn-sm"
            >
              Crear nuevo horario
            </Link>

      {loading ? (
        <p>Cargando horarios...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario) => (
              <tr key={horario.id}>
                <td>{horario.date}</td>
                <td>{horario.time}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleEliminarHorario(horario.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modalVisibility && (
        <ConfirmModal
          onConfirm={onConfirm}
          onCancel={onCancel}
          message="¿Estás seguro de que deseas eliminar este horario?"
        />
      )}
    </div>
  );
}

