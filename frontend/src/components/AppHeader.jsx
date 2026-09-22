function AppHeader({
  user,
  title,
  onLogout,
  onNavigate,
}) {
  const roleLabel = user?.role === 'admin' ? 'Admin' : 'Karyawan'
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U'

  const activeView = (() => {
    if (user?.role === 'admin') {
      if (title?.includes('Fasilitas')) return 'facilities'
      if (title?.includes('Laporan')) return 'reports'
      return 'dashboard'
    }

    if (title?.includes('Buat Laporan')) return 'create-report'
    if (title?.includes('Laporan')) return 'my-reports'
    if (title?.includes('Fasilitas')) return 'facilities'
    return 'dashboard'
  })()

  const navButton = (view, icon, label) => (
    <button
      type="button"
      className={`sidebar-nav-button ${activeView === view ? 'active' : ''}`}
      onClick={() => onNavigate(view)}
    >
      <span className="sidebar-nav-icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  )

  return (
    <>
      <aside className="fasi-sidebar">
        <button
          type="button"
          className="sidebar-brand"
          onClick={() => onNavigate('dashboard')}
          aria-label="Kembali ke dashboard"
        >
          <span className="fasi-brand-icon" aria-hidden="true">
            <span className="fasi-wrench">⌕</span>
            <span className="fasi-sheet">▤</span>
          </span>
          <span className="fasi-brand-text">
            <strong>FasiReport</strong>
            <small>Aplikasi Pelaporan Kerusakan Fasilitas</small>
          </span>
        </button>

        <nav className="fasi-sidebar-nav">
          {user?.role === 'employee' && (
            <>
              {navButton('dashboard', '⌂', 'Dashboard')}
              {navButton('my-reports', '▣', 'Laporan Saya')}
              {navButton('create-report', '✎', 'Buat Laporan')}
              {navButton('facilities', '▦', 'Daftar Fasilitas')}
            </>
          )}

          {user?.role === 'admin' && (
            <>
              {navButton('dashboard', '⌂', 'Dashboard Statistik')}
              {navButton('reports', '▤', 'Semua Laporan')}
              {navButton('facilities', '⚒', 'Kelola Fasilitas')}
            </>
          )}
        </nav>

        <div className="sidebar-spacer" />

        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
        >
          <span aria-hidden="true">↪</span>
          <span>Logout</span>
        </button>
      </aside>

      <header className="fasi-topbar">
        <div className="topbar-page-title">
          <span className="topbar-eyebrow">FasiReport</span>
          <strong>{title}</strong>
        </div>

        <div className="header-user">
          <button
            type="button"
            className="topbar-icon-button"
            aria-label="Notifikasi"
            title="Notifikasi"
          >
            ●
          </button>

          <div className="user-avatar" aria-hidden="true">{initial}</div>

          <div className="user-meta">
            <strong>{user?.name}</strong>
            <span>{roleLabel}</span>
          </div>

          <button
            type="button"
            className="topbar-logout-button"
            onClick={onLogout}
            aria-label="Logout"
            title="Logout"
          >
            ↪
          </button>
        </div>
      </header>
    </>
  )
}

export default AppHeader
