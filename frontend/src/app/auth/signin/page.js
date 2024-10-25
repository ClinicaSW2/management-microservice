'use client';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: data.username,
      password: data.password,
    });

    if (result.ok) {
      router.push('/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Login</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    className="form-control"
                    {...register('username', { required: true })}
                  />
                  {errors.username && <span className="text-danger">This field is required</span>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    {...register('password', { required: true })}
                  />
                  {errors.password && <span className="text-danger">This field is required</span>}
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
