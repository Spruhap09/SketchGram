import AuthProvider from '@/context/AuthContext'
import firebaseConfig from '@/firebase/config'
import '@/styles/globals.css'
import { initializeApp } from 'firebase/app'
import type { AppProps } from 'next/app'

const app = initializeApp(firebaseConfig);
export default function App({ Component, pageProps }: AppProps) {
  return <AuthProvider>
    <Component {...pageProps} />
    </AuthProvider>
}
