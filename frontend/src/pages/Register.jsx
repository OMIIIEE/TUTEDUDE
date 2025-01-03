import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    gender: "",
    username: "", // Added username field
  });
  const navigate = useNavigate();
  const { loading, error , token} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (token) {
      // Redirect to the dashboard once the token is set
      navigate("/dashboard"); 
    }
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Modify the form data to send the fullname object
    const formData = {
      fullname: {
        firstname: form.firstname,
        lastname: form.lastname,
      },
      email: form.email,
      password: form.password,
      gender: form.gender,
      username: form.username, // Include the username as well
    };
  
    dispatch(registerUser(formData)); // Dispatch the modified form data
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Create an Account
        </h1>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-600">First Name</label>
            <Input
              type="text"
              name="firstname"
              placeholder="Enter your first name"
              value={form.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-600">Last Name</label>
            <Input
              type="text"
              name="lastname"
              placeholder="Enter your last name"
              value={form.lastname}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-600">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-600">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-600">Gender</label>
            <select
              name="gender"
              className="block w-full px-4 py-2 text-sm border rounded focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          {/* Username field */}
          <div>
            <label className="block mb-2 text-sm text-gray-600">Username</label>
            <Input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>
        
        {/* Login Link */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
