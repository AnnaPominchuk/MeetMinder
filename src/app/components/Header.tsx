import Image from 'next/image'

export default function Header ({time} : {time:Date}) {
    return (
        <div className='flex justify-between my-4 mx-6 2xl:mt-20'>
          <div className='relative w-[30%] aspect-ratio-30'>
            <Image 
              src="/logo.png"
              fill
              style={{objectFit: "contain"}}
              alt="Logo"
              priority={true}
              sizes="(max-width: 1536px) 30vw"
            />
          </div>
          <div className='flex flex-col py-4 px-3 items-end'>
            <div className="text-lg font-medium 2xl:text-3xl">
              <p suppressHydrationWarning>
                { time.toLocaleDateString('en-GB', { day: "numeric", month: "long", year: "numeric"}) }
              </p>
            </div>
            <div className="text-lg font-medium 2xl:text-3xl">
              <p suppressHydrationWarning>
                { time.toLocaleTimeString() } 
              </p>
            </div>
         </div>
      </div>
    )
}