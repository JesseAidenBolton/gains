import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import {ClerkProvider} from '@clerk/nextjs'
import Provider from "@/components/Provider";
import {SelectedDateProvider} from "@/contexts/SelectedDateContext";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gains',
  description: 'Workout Tracking App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <ClerkProvider>
          <SelectedDateProvider>
              <html lang="en">
              <Provider>
                  <body className={inter.className}>{children}</body>
              </Provider>
              </html>
          </SelectedDateProvider>
      </ClerkProvider>
  )
}
