import AuthProvider from '@/context/AuthContext'
import '@/styles/globals.css'
import initFirebaseConfig from '@/firebase/firebase'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../context/ThemeContext'

initFirebaseConfig() // initialize firebase
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  )
  }
