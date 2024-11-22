import { useLocation } from 'wouter'
import { Button } from '@nextui-org/react'

function ErrorPage() {
  const [_, setLocation] = useLocation()

  return (
    <main className="m-auto">
      <div className="flex flex-col items-center gap-y-[30px] text-center m-auto mt-40">
        <div className="flex justify-center gap-2">
          <div className="w-[80px] h-[80px] bg-success-600 grid place-items-center rounded">
            <div className="eye__pupil"></div>
          </div>
          <div className="w-[80px] h-[80px] bg-success-600 grid place-items-center rounded">
            <div className="eye__pupil"></div>
          </div>
        </div>
        <div>
          <h1 className="capitalize text-3xl font-semibold text-gray-300">Looks like you're lost</h1>
          <p className="mt-2 text-xl text-gray-400">404 error</p>
        </div>
        <Button
          color="success"
          size='lg'
          variant='ghost'
          className='p-8 font-semibold'
          onClick={() => setLocation('/')}
        >
          Return Home
        </Button>
      </div>
    </main>

  )
}

export default ErrorPage