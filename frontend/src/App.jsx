
import { SignedOut, SignInButton, SignedIn, SignOutButton, UserButton} from '@clerk/clerk-react';
function App() {
  

  return (
    <>
      <h1 className="text-red-500 bg-orange-400 p-10 text-3xl">Welcome to the app</h1>
      <button className="btn btn-secondary">Click me</button>

        <SignedOut>
          <SignInButton mode = "modal">
            <button>Login</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <SignOutButton />
        </SignedIn>

        <UserButton />
    </>
  );
}

export default App;
