"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';

export default function CrearHorario() {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  const [formData, setFormData] = useState({ date: '', time: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 porque los meses van de 0 a 11
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (sessionStatus === 'authenticated') {
        const token = sessionData.accessToken;

        setGraphQLClientHeaders({
          authorization: `Bearer ${token}`,
        });

        const mutation = `
          mutation StoreHorario {
            storeHorario(request: { date: "${formatDate(formData.date)}", time: "${formData.time}:00" }) {
              id
              date
              time
            }
          }
        `;
        
        const { storeHorario } = await graphQLClient.request(mutation);
        if (storeHorario && storeHorario.id) {
          router.push('/home/horario');
        }
      }
    } catch (error) {
      console.error('Error creating horario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Crear Nuevo Horario</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Fecha</label>
          <input type="date" className="form-control" id="date" name="date" value={formData.date} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="time" className="form-label">Hora</label>
          <input type="time" className="form-control" id="time" name="time" value={formData.time} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Crear Horario</button>
      </form>
    </div>
  );
}
