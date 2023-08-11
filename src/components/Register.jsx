import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import '../style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [registrationStatus, setRegistrationStatus] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = (data) => {
    const registrationDateTime = new Date();
    const formattedDateTime = registrationDateTime
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const dataToSend = {
      ...data,
      registration_time: formattedDateTime,
    };

    axios
      .post('https://node-myql.onrender.com/register', dataToSend)
      .then((response) => {
        console.log('Registration response:', response.data);
        if (response.data.message === 'User already exists') {
          setRegistrationStatus('User already exists');
        } else if (response.data.message) {
          setRegistrationStatus(response.data.message);
        } else {
          setRegistrationStatus('Account created successfully!');
          navigate('/');
        }
      })
      .catch((error) => {
        console.error('Registration failed:', error);
      });
  };

  return (
    <div className="signup template d-flex justify-content-center align-items-center 100w vh-100 bg-primary">
      <div className=" 50-w p-5 rounded bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-center">Sign up</h3>
          <div className="mb-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>

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
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign up
            </button>
          </div>
        </form>
        {registrationStatus && <p className="error">{registrationStatus}</p>}
      </div>
    </div>
  );
}

export default Register;
