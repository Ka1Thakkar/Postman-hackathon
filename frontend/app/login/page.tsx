import { login, signup } from "./actions"

export default function LoginPage() {
  return (
    <div className="w-[99vw] h-[100vh] flex">
      <div className="w-[33%] bg-hivegreen h-[100%]">
        <div className="flex flex-col justify-center"></div>
        <div className="text-center text-4xl text-hivewhite font-polyamine mt-[150px] mb-[90px]">Revolutionise Your Healthcare with Hivecare</div>
        <div className="bg-login bg-cover bg-center bg-no-repeat w-[100%] h-[65%] opacity-50"></div>
      </div>
      <div className="flex justify-center w-[66vw]">
        <div className="flex flex-col justify-center">
          <form>
            <div className="flex flex-col bg-hiveoffwhite w-[33vw] h-[70vh] rounded-xl">
              <div className="text-4xl font-polyamine text-center my-20">Login</div>
              <div className="flex justify-center">
                <div className="w-[540px] flex justify-center">
                  <input id="email" name="email" type="email" placeholder="Email" required className="w-[100%] border-black border-2 rounded-xl bg-hiveoffwhite text-black p-2" />
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="w-[540px] flex justify-center">
                  <input id="password" name="password" type="password" placeholder="Password" required className="w-[100%] border-black border-2 rounded-xl bg-hiveoffwhite text-black p-2" />
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <div className="w-[540px] flex justify-center">
                  <button formAction={login} className="w-[100%] border-2 rounded-xl text-l bg-hivegreen text-hiveoffwhite font-poppins p-2">
                    Log in
                  </button>
                </div>
              </div>

              <button formAction={signup}>Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
