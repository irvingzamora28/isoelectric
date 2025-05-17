'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type {
  GalleryImage,
  GallerySection as GallerySectionType,
} from '../app/allset/landing-content/types'

interface GallerySectionProps {
  gallery: GallerySectionType
  variant?: 'light' | 'dark'
}

const GallerySection: React.FC<GallerySectionProps> = ({ gallery, variant = 'light' }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image)
    document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
  }

  const closeModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto' // Re-enable scrolling
  }

  // Close modal when Escape key is pressed
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    if (selectedImage) {
      window.addEventListener('keydown', handleEscKey)
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey)
    }
  }, [selectedImage])

  const isDark = variant === 'dark'

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className={`relative overflow-hidden py-20 sm:py-32 ${
        isDark ? 'bg-slate-900 text-white' : 'border-t border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="gallery-title"
            className={`font-display text-3xl tracking-tight sm:text-4xl ${
              isDark ? 'text-white' : 'text-slate-900 dark:text-slate-200'
            }`}
          >
            {gallery.title}
          </h2>
          <p
            className={`mt-4 text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {gallery.description}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {gallery.images.map((image, index) => (
            <div
              key={index}
              className={`group relative cursor-pointer overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg ${
                isDark ? 'bg-slate-800' : 'bg-slate-100 dark:bg-slate-800'
              }`}
              onClick={() => openModal(image)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openModal(image)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${image.alt} in large mode`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={450}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p
                  className={`text-center font-medium ${
                    isDark ? 'text-white' : 'text-slate-900 dark:text-slate-200'
                  }`}
                >
                  {image.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <dialog
          open
          className="bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
          onClick={closeModal}
          onKeyDown={(e) => e.key === 'Escape' && closeModal()}
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <article
            className={`relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg p-1 ${
              isDark ? 'bg-slate-800' : 'bg-white dark:bg-slate-800'
            }`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="document"
          >
            <button
              className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-xl font-bold shadow-md ${
                isDark
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-white text-black hover:bg-gray-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'
              }`}
              onClick={closeModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="relative">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={900}
                className="max-h-[80vh] w-auto object-contain"
              />
              <div className="p-4 text-center">
                <p
                  className={`text-lg font-medium ${
                    isDark ? 'text-white' : 'text-slate-900 dark:text-slate-200'
                  }`}
                >
                  {selectedImage.caption}
                </p>
              </div>
            </div>
          </article>
        </dialog>
      )}
    </section>
  )
}

export default GallerySection
