// pages/usuarios/index.js
'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { graphQLClient, setGraphQLClientHeaders } from '@/services/graphql';
import { gql } from "graphql-request"
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
      })

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

      const data = await graphQLClient.request(query);
      const response = data?.listarUsuario
      setUsuarios(response); // Establece los usuarios en el estado
    } catch (error) {
      if (error.response) {
        if (error.response.errors && error.response.errors[0] && error.response.errors[0].message) {
          if (error.response.errors[0].message === "Unauthorized") {
            signOut();
            router.push('/auth/signin')
          }
        }
      }
    }
  };

  const handleCrearUsuario = () => {
    router.push('/home/manage-doctor/create');
  };

  const handleActualizarUsuario = (doctorData) => {
    localStorage.setItem('doctorData', JSON.stringify(doctorData));
    router.push(`/home/manage-doctor/edit`);
  };

  const handleEliminarUsuario = (id) => {
    setUserFix(id);
    showModal();
  };

  const showModal = (newValue = true) => {
    setModalVisibility(newValue)
  };

  const onCancel = () => {
    showModal(false);
  }

  const onConfirm = async () => {
    const queryDelete = gql`
    mutation DeleteDoctor {
      deleteDoctor(id: "${userFix}")
    }`;
    try {
      console.log(userFix)
      const data = await graphQLClient.request(queryDelete);
      console.log(data)
      showModal(false);
      setRefreshPage(!refreshPage);
    } catch(error) {
      console.log(error)
      showModal(false);
    }
  }

  return (
    <div className="container">
      <h1>Lista de Usuarios</h1>
      <button className="btn btn-primary mb-3" onClick={handleCrearUsuario}>Crear Usuario</button>
      {modalVisibility && <ConfirmModal onConfirm={onConfirm} onCancel={onCancel}></ConfirmModal>}
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
