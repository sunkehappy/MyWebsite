'use client'

import { Dialog, Transition } from '@headlessui/react'
import NextImage, { ImageProps } from 'next/image'
import { Fragment, useState } from 'react'

const basePath = process.env.BASE_PATH

function resolveSrc(src: ImageProps['src']) {
  if (typeof src === 'string') {
    return `${basePath || ''}${src}`
  }
  return src
}

const ZoomableImage = ({ src, alt = '', className, ...rest }: ImageProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const imageSrc = resolveSrc(src)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="m-0 block cursor-zoom-in border-0 bg-transparent p-0"
        aria-label={alt ? `放大图片：${alt}` : '放大图片'}
      >
        <NextImage src={imageSrc} alt={alt} className={className} {...rest} />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-80" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative outline-none">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="absolute -right-1 -top-10 rounded-full p-1 text-white/80 hover:text-white"
                    aria-label="关闭"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-7 w-7"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="cursor-zoom-out border-0 bg-transparent p-0"
                    aria-label="关闭图片预览"
                  >
                    {typeof imageSrc === 'string' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageSrc}
                        alt={alt}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                      />
                    ) : (
                      <NextImage
                        src={imageSrc}
                        alt={alt}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                        {...rest}
                      />
                    )}
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ZoomableImage
