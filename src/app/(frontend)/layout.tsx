import './styles.css'
import { AppProvider } from '../(frontend)/context/AppContext'
import Navbar from './components/Navbar'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar />
          <div>{children}</div>
        </AppProvider>
      </body>
    </html>
  )
}
