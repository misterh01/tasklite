import { Button, Navbar, NavbarBrand, useDisclosure } from "@nextui-org/react";
import { useLocation } from "wouter";
import { useColumnButtonStore } from "../store";
import { Fragment } from "react/jsx-runtime";
import CreateColumnModal from "./modals/ColumnModal";

function NavigationBar() {
  const [location, setLocation] = useLocation();
  const showColumnButton = useColumnButtonStore((state) => state.showColumnButton)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()


  const onHomeClick = () => {
    if (location.startsWith('/boards/')) {
      return setLocation('/boards')
    }

    if (location === '/boards') return
    setLocation('/')
  }

  return (
    <Fragment>
      <Navbar
        maxWidth="full"
        className="bg-stone-950"
      >
        <NavbarBrand
        >
          <h1 onClick={onHomeClick} className="font-bold text-3xl text-green-600 cursor-pointer">TaskLite</h1>
        </NavbarBrand>

        {location.startsWith('/boards/') && showColumnButton &&
          <Button color="success" onPress={onOpen}>
            Add Column
          </Button>
        }

        {location === '/' && (
          <Button
            variant="ghost"
            color="success"
            onClick={() => setLocation('/boards')}
          >
            Go to Dashboard
          </Button>
        )}
      </Navbar>

      {isOpen && (
        <CreateColumnModal
          boardId={location.split('/boards/')[1]}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </Fragment>
  );
}

export default NavigationBar;