function AppHeader({
  user,
  title,
  onLogout,
  onNavigate,
}) {
  return (
    <header className="dashboard-header app-header">
      <div className="app-brand">
        <h1>Facility Report</h1>
        <p>{title}</p>
      </div>

      <nav className="app-navigation">
        {user?.role === 'employee' && (
          <>
            <button
              type="button"
              className="nav-button"
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() => onNavigate('create-report')}
            >
              Buat Laporan
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() => onNavigate('my-reports')}
            >
              Laporan Saya
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() => onNavigate('facilities')}
            >
              Fasilitas
            </button>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <button
              type="button"
              className="nav-button"
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() => onNavigate('reports')}
            >
              Semua Laporan
            </button>

            <button
              type="button"
              className="nav-button"
              onClick={() => onNavigate('facilities')}
            >
              Fasilitas
            </button>
          </>
        )}
      </nav>

      <div className="header-user">
        <span>{user?.name}</span>

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default AppHeader