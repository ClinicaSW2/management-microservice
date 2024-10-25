'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';
import { gql } from "graphql-request";
import { useSession } from 'next-auth/react';

export default function CrearActualizarUsuario() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const [token, setToken] = useState('');
  const [initialData, setInitialData] = useState(null);
  const searchParams = useSearchParams()
 

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      setToken(sessionData.accessToken);
    }
    const data = localStorage.getItem('doctorData');
    if (data) {
      setInitialData(JSON.parse(data));
      localStorage.removeItem('doctorData');
    }
    console.log(data)
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        password: '',
        email: initialData.email || '',
        name: initialData.name || '',
        lastName: initialData.lastName || '',
        address: initialData.address || '',
        ci: initialData.ci || '',
        sexo: initialData.sexo || '',
        contactNumber: initialData.contactNumber || '',
        birthDate: initialData.birthDate || '',
        url: initialData.url || '',
        titulo: initialData.titulo || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mutation = initialData ? UPDATE_DOCTOR : STORE_DOCTOR;
    const variables = { input: formData };

    setGraphQLClientHeaders({
      authorization: `Bearer ${token}`,
    });

    try {
      const data = await graphQLClient.request(mutation, variables);
      console.log(data);

      router.push("/home/manage-doctor");
    } catch (error) {
      if (error.request) {
        console.log(error);
      } else {
        console.log("Ups", error);
      }
    }
  };

  const STORE_DOCTOR = gql`
    mutation StoreDoctor($input: StoreDoctorInput!) {
      storeDoctor(request: $input) {
        message
      }
    }
  `;

  const UPDATE_DOCTOR = gql`
    mutation UpdateDoctor($input: UpdateDoctorInput!) {
      updateDoctor(request: $input) {
        message
      }
    }
  `;

  return (
    <div className="container">
      <h1>{initialData ? 'Actualizar Usuario' : 'Crear Usuario'}</h1>
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
          <select className="form-control" id="sexo" name="sexo" value={formData.sexo} onChange={handleChange}>
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
        <button type="submit" className="btn btn-primary">{initialData ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>
  );
}
