'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';

export default function Reservaciones() {
    const router = useRouter();
    const { data: sessionData, status: sessionStatus } = useSession();
    const [reservaciones, setReservaciones] = useState([]);
    const [updatePage, setUpdate] = useState(true);

    useEffect(() => {
        if (sessionStatus === 'unauthenticated') {
            router.push('/auth/signin');
        }
        if (sessionStatus === 'authenticated') {
            fetchReservaciones(sessionData.accessToken);
        }
    }, [sessionStatus, updatePage]);

    const updatPage = () => setUpdate(!updatePage);

    const fetchReservaciones = async (token) => {
        try {
            setGraphQLClientHeaders({
                authorization: `Bearer ${token}`,
            });

            const query = `
        query GetReservacion {
          getReservacion {
            id
            place
            state
            available_time {
              id
              date
              time
            }
            paciente {
              id
              name
              lastName
              address
              ci
              sexo
              contactNumber
              titulo
              user {
                id
                username
                email
                role
              }
            }
          }
        }
      `;

            const { getReservacion } = await graphQLClient.request(query);
            setReservaciones(getReservacion);
        } catch (error) {
            if (error.response && error.response.errors) {
                const errorMessage = error.response.errors[0]?.message;
                if (errorMessage === 'Unauthorized') {
                    signOut();
                    router.push('/auth/signin');
                }
            } else {
                console.error('Error fetching reservaciones:', error);
            }
        }
    };

    const handleVerPaciente = (paciente) => {
        localStorage.setItem('pacienteData', JSON.stringify(paciente));
        router.push(`/home/manage-paciente`);
    };

    const updateReserva = async (id) => {

        const query = `mutation FinalizarReserva {
        FinalizarReserva(id: "${id}") {
            id
            place
            state
        }
    }`;

        try {
            const result = await graphQLClient.request(query);
            console.log(result)
            updatPage();
        } catch(error) {
            if (error.response && error.response.errors) {
                const errorMessage = error.response.errors[0]?.message;
                if (errorMessage === 'Unauthorized') {
                    signOut();
                    router.push('/auth/signin');
                }
            } else {
                console.error('Error fetching reservaciones:', error);
            }
        }
    }

    return (
        <div className="container">
            <h1>Horarios Reservados</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Lugar</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reservaciones.map(reservacion => (
                        <tr key={reservacion.id}>
                            <td>{reservacion.place}</td>
                            <td>{reservacion.state}</td>
                            <td>{reservacion.available_time.date}</td>
                            <td>{reservacion.available_time.time}</td>
                            <td>
                                <div className='row'>
                                    <div className='col'>
                                        <button
                                            className="btn btn-info"
                                            onClick={() => handleVerPaciente(reservacion.paciente)}
                                        >
                                            Ver Paciente
                                        </button>
                                    </div>
                                    <div className='col'>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => updateReserva(reservacion.id)}
                                        >
                                            Finalizar Reserva
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
