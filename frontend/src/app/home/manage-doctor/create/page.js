'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';
import { gql } from "graphql-request"
import { useSession } from 'next-auth/react';

export default function CrearUsuario() {
  const router = useRouter();
  const { data, status } = useSession();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
    if (status === "authenticated") {
      setToken(data.accessToken);
    }
  }, [status]);

  const [formData, setFormData] = useState({
    password: '',
    email: '',
    name: '',
    lastName: '',
    address: '',
    ci: '',
    sexo: '',
    contactNumber: '',
    birthDate: '',
    url: '',
    titulo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const STORE_DOCTOR = gql`
    mutation StoreDoctor {
      storeDoctor(
        request: {
          email: "${formData.email}"
          password: "${formData.password}"
          name: "${formData.name}"
          last_name: "${formData.lastName}"
          address: "${formData.address}"
          ci: "${formData.ci}"
          sexo: "${formData.sexo}"
          contact_number: "${formData.contactNumber}"
          birth_date: "${formatDate(formData.birthDate)}"
          url: "${formData.url}"
          titulo: "${formData.titulo}"
        }
      )
    }
  `;
    setGraphQLClientHeaders({
      authorization: `Bearer ${token}`,
    });

    try {
      const data = await graphQLClient.request(STORE_DOCTOR);
      console.log(data);

      router.push("/home/manage-doctor");
    } catch (error) {
      if (error.request) {
        console.log(error)
      } else {
        console.log("Ups", error)
      }
    }


  };

  function formatDate(dateBirth) {
    const date = new Date(dateBirth);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  }

  return (
    <div className="container">
      <h1>Crear Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo Electrónico</label>
          <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Apellido</label>
          <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Dirección</label>
          <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="ci" className="form-label">CI</label>
          <input type="text" className="form-control" id="ci" name="ci" value={formData.ci} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="sexo" className="form-label">Sexo</label>
          <select
            className="form-control"
            id="sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otros</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="contactNumber" className="form-label">Número de Contacto</label>
          <input type="text" className="form-control" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="birthDate" className="form-label">Fecha de Nacimiento</label>
          <input type="date" className="form-control" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="url" className="form-label">URL</label>
          <input type="text" className="form-control" id="url" name="url" value={formData.url} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">Título</label>
          <input type="text" className="form-control" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Crear</button>
      </form>
    </div>
  );
}
