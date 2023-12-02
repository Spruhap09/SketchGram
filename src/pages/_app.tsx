import AuthProvider from '@/context/AuthContext'
import { PostsProvider } from '@/context/PostsContext'
import '@/styles/globals.css'
import initFirebaseConfig from '@/firebase/firebase'
import type { AppProps } from 'next/app'

initFirebaseConfig() // initialize firebase
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PostsProvider>
        <Component {...pageProps} />
      </PostsProvider>
    </AuthProvider>
  )
  }
