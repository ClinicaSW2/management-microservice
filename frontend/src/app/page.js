import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Clínica de Oftalmología</title>
      </Head>
      <header className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4">Clínica de Oftalmología</h1>
          <p className="lead">Cuidando de tu visión con los mejores especialistas</p>
        </div>
      </header>
      <main className="container my-5">
        <section className="mb-5">
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <img src="/images/examen.jpg" className="card-img-top" alt="Examen de la vista" />
                <div className="card-body">
                  <h5 className="card-title">Exámenes de la Vista</h5>
                  <p className="card-text">Realizamos exámenes completos para diagnosticar y tratar problemas de visión.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img src="/images/cirugia.jpg" className="card-img-top" alt="Cirugía ocular" />
                <div className="card-body">
                  <h5 className="card-title">Cirugía Ocular</h5>
                  <p className="card-text">Especialistas en cirugías avanzadas para mejorar tu salud visual.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img src="/images/consultorio.jpg" className="card-img-top" alt="Consultorio" />
                <div className="card-body">
                  <h5 className="card-title">Consultas Personalizadas</h5>
                  <p className="card-text">Atención personalizada para cada uno de nuestros pacientes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="text-center">
          <h2>Nuestros Servicios</h2>
          <p className="lead">Ofrecemos una amplia gama de servicios para el cuidado de tu visión.</p>
          <ul className="list-unstyled">
            <li>Diagnóstico y tratamiento de enfermedades oculares</li>
            <li>Exámenes de vista rutinarios</li>
            <li>Cirugía refractiva</li>
            <li>Tratamiento de cataratas y glaucoma</li>
            <li>Asesoría y adaptación de lentes de contacto</li>
          </ul>
        </section>
      </main>
      <footer className="bg-light text-center py-4">
        <div className="container">
          <p className="mb-0">© 2024 Clínica de Oftalmología. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}


/*
      <h1>Sistema de gestion oftalmologica</h1>
      <div className="center">
        <div className="link-next btn btn-primary">
          <a href="/auth/signin">Inicia sesion</a>
        </div>
        <div className="link-next btn btn-secondary">
          <a href="/auth/signup">Registrate</a>
        </div>
      </div>
*/