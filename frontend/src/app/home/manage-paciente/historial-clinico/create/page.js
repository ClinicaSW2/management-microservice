'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { gql } from 'graphql-request';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';
import { useSession } from 'next-auth/react';

export default function CrearDetalleHistoria() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pacienteID, setPacienteID] = useState(null); // Estado para almacenar el ID del paciente
  const [formData, setFormData] = useState({
    title: '',
    notes: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (typeof window !== 'undefined') {
      // Solo en el cliente, obtenemos el pacienteID de localStorage
      const id = localStorage.getItem("pacienteID");
      setPacienteID(id);
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pacienteID) return; // Asegura que pacienteID esté disponible antes de ejecutar la mutación

    const mutation = gql`
    mutation Store_StoryDetail {
        store_StoryDetail(
            request: {
                paciente_id: "${id}"
                notes: "${formData.notes}"
                title: "${formData.title}"
                id: null
            }
        ) {
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
      const response = await graphQLClient.request(mutation);
      console.log('Detalle de historia creado:', response.store_StoryDetail);
      router.push(`/home/manage-paciente/historial-clinico`);
    } catch (error) {
      console.error('Error al crear el detalle de historia:', error);
    }
  };

  return (
    <div className="container">
      <h1>Crear Detalle de Historia Clínica</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="notes" className="form-label">Notas</label>
          <textarea
            className="form-control"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Crear</button>
      </form>
    </div>
  );
}
