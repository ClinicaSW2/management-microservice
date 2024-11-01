'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { gql } from 'graphql-request';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';
import { useSession } from 'next-auth/react';

export default function CrearTratamiento() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pacienteID, setPacienteID] = useState(null); // Estado para almacenar el ID del paciente
  const [formData, setFormData] = useState({
    detail: '',
    title: '',
    recipe: '',
  });
  const [loading, setLoading] = useState(false);

  // Cargar el ID del paciente desde localStorage solo en el cliente
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem("tratPaciente");
      setPacienteID(id);
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!pacienteID) {
      console.error('El pacienteID no está disponible.');
      setLoading(false);
      return;
    }

    const mutation = gql`
    mutation StoreTratamieto {
        storeTratamieto(
            request: {
                detail: "${formData.detail}"
                title: "${formData.title}"
                recipe: "${formData.recipe}"
                paciente_id: "${id}"
            }
        ) {
            id
            detail
            title
            recipe
        }
    }    
    `;

    setGraphQLClientHeaders({
      authorization: `Bearer ${session.accessToken}`,
    });

    try {
      const response = await graphQLClient.request(mutation);
      router.push(`/home/manage-paciente/tratamiento`);
    } catch (error) {
      console.error('Error al crear el tratamiento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Crear Tratamiento</h1>
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
          <label htmlFor="detail" className="form-label">Detalle</label>
          <textarea
            className="form-control"
            id="detail"
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="recipe" className="form-label">Receta</label>
          <textarea
            className="form-control"
            id="recipe"
            name="recipe"
            value={formData.recipe}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creando...' : 'Crear'}
        </button>
      </form>
    </div>
  );
}
