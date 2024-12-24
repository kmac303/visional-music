import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => {
      if (r.ok) {
        navigate("/");
      } else {
        alert("Signup failed!");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Sign Up</h1>
      <label>Username</label>
      <input {...register("username", { required: "Username is required" })} />
      {errors.username && <p>{errors.username.message}</p>}

      <label>Password</label>
      <input type="password" {...register("password", { required: "Password is required" })} />
      {errors.password && <p>{errors.password.message}</p>}

      <label>Confirm Password</label>
      <input
        type="password"
        {...register("password_confirmation", {
          validate: (value) =>
            value === watch("password") || "Passwords do not match",
        })}
      />
      {errors.password_confirmation && <p>{errors.password_confirmation.message}</p>}

      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;