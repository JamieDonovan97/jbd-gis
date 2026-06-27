function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight">GIS Platform</h1>
      </header>
      <main className="p-6">
        <p className="text-gray-500 text-sm">Platform initialising…</p>
      </main>
      <footer className="px-6 py-4 text-xs text-gray-400">
        build {__APP_VERSION__}
      </footer>
    </div>
  )
}

export default App
