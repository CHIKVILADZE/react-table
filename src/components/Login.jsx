import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import '../style.css';
import axios from 'axios';

function Login({ loginStatus, setLoginStatus }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = (data) => {
    const lastLoginTime = new Date();
    const formattedDateTime = lastLoginTime
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const dataToSend = {
      ...data,
      lastLoginTime: formattedDateTime,
    };

    console.log(dataToSend.lastLoginTime);

    axios
      .post('https://node-myql.onrender.com/login', dataToSend)
      .then((response) => {
        if (response.data.message) {
          setLoginStatus(response.data.message);
        } else {
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  };
  return (
    <div className="login template d-flex justify-content-center align-items-center 100w vh-100 bg-primary">
      <div className=" 50-w p-5 rounded bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-center">Sign In</h3>
          <div className="mb-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              {...register('email', {
                required: 'Email is required',

                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
          <h1 className="error">{loginStatus}</h1>
          <div className="d-grid">
            <button className="btn btn-primary">Sign in</button>
          </div>
          <Link to="/register" className="ms-2 ">
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
