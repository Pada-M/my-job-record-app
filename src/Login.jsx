export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <form className="flex flex-col w-72 gap-2.5">
        <h2 className="text-3xl font-bold underline">Login</h2>
        <input type="email" placeholder="Email" required className="border p-2 rounded" />
        <input type="password" placeholder="Password" required className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}