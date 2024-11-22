import { NextUIProvider } from "@nextui-org/react";
import NavigationBar from "./components/NavigationBar";
import { Route, Switch } from "wouter";
import LandingPage from "./components/LandingPage";
import BoardsList from "./components/BoardsList";
import ErrorPage from "./components/ErrorPage";
import Kanban from "./components/Kanban";

function App() {
  return (
    <NextUIProvider>
      <div className="flex flex-col h-screen">
        <NavigationBar />

        <div className="grow">
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/boards" component={BoardsList} />
            <Route path="/boards/:id">
              {params => <Kanban boardId={params.id} />}
            </Route>

            <Route component={ErrorPage} />
          </Switch>
        </div>

        <footer className="bottom-0 bg-stone-950 p-4 w-full mt-2">
          <h3 className="text-center text-lg text-white">
            Copyright &#169; {new Date().getFullYear()} <a href="https://misterh.dev/" target="_blank" className="hover:text-green-600">misterh</a>
          </h3>
        </footer>
      </div>
    </NextUIProvider>
  )
}

export default App
