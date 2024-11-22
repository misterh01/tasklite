import { Button } from '@nextui-org/react'
import { Fragment } from 'react'
import { Link } from 'wouter'

const LandingPage = () => {
  const features = [
    {
      title: 'Local Storage',
      description: 'Save work locally for offline access.'
    },
    {
      title: 'Drag and Drop',
      description: 'Organize tasks easily with drag-and-drop.'
    },
    {
      title: 'Custom Workflows',
      description: 'Customize boards to fit your needs.'
    }
  ]
  return (
    <Fragment>
      <section
        className="text-center bg-black text-white py-[10%] mx-[10%] shadow-2xl shadow-green-600 rounded-lg"
      >
        <h1 className="text-2xl font-semibold">Simplify Task Management, Achieve More Every Day</h1>
        <p className="text-gray-500 text-lg mt-6 font-semibold">
          Plan, prioritize, and complete tasks effortlessly with TaskLite.
        </p>
        <Button
          variant='solid'
          color='success'
          size='lg'
          radius='sm'
          className="p-6 mt-6 font-bold text-2xl text-black "
        >
          <Link href="/boards">Get Started</Link>
        </Button>
      </section>


      <section className="py-[6%] mx-[10%]">
        <h2 className="text-4xl text-white font-semibold mt-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-black p-4 mt-2 rounded-lg shadow-md shadow-green-600">
              <h3 className="text-2xl text-gray-300 font-semibold">{feature.title}</h3>
              <p className="text-gray-500 mt-2 font-semibold">{feature.description}</p>
            </div>
          ))}

        </div>
      </section>
    </Fragment>
  )
}

export default LandingPage