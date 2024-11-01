'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';
import { gql } from "graphql-request";
import ConfirmModal from '@/components/confirm-modal';

export default function UsuariosIndex() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const { data, status } = useSession();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [userFix, setUserFix] = useState(-1);
  const [refreshPage, setRefreshPage] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
    if (status === "authenticated") {
      fetchUsuarios(data.accessToken);
    }
  }, [status, refreshPage]);

  const fetchUsuarios = async (token) => {
    try {
      setGraphQLClientHeaders({
        authorization: `Bearer ${token}`,
      });

      const query = `
      query ListarUsuario {
        listarUsuario {
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
    `;

      const response = await graphQLClient.request(query);
      setUsuarios(response?.listarUsuario);
    } catch (error) {
      if (error.response?.errors[0]?.message === "Unauthorized") {
        signOut();
        router.push('/auth/signin');
      }
    }
  };

  const handleCrearUsuario = () => {
    router.push('/home/manage-doctor/create');
  };

  const handleActualizarUsuario = (doctorData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('doctorData', JSON.stringify(doctorData));
      router.push(`/home/manage-doctor/edit`);
    }
  };

  const handleEliminarUsuario = (id) => {
    setUserFix(id);
    setModalVisibility(true);
  };

  const onCancel = () => setModalVisibility(false);

  const onConfirm = async () => {
    const queryDelete = gql`
    mutation DeleteDoctor {
      deleteDoctor(id: "${userFix}")
    }`;
    try {
      await graphQLClient.request(queryDelete);
      setModalVisibility(false);
      setRefreshPage(!refreshPage);
    } catch (error) {
      console.error(error);
      setModalVisibility(false);
    }
  };

  return (
    <div className="container">
      <h1>Lista de Usuarios</h1>
      <button className="btn btn-primary mb-3" onClick={handleCrearUsuario}>Crear Usuario</button>
      {modalVisibility && <ConfirmModal onConfirm={onConfirm} onCancel={onCancel} />}
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>CI</th>
            <th>Sexo</th>
            <th>Número de Contacto</th>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.name}</td>
              <td>{usuario.lastName}</td>
              <td>{usuario.address}</td>
              <td>{usuario.ci}</td>
              <td>{usuario.sexo}</td>
              <td>{usuario.contactNumber}</td>
              <td>{usuario.titulo}</td>
              <td>
                <button className="btn btn-info" onClick={() => handleActualizarUsuario(usuario)}>Actualizar</button>
                <button className="btn btn-danger ml-2" onClick={() => handleEliminarUsuario(usuario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
