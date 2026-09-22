import { useEffect, useRef, useState } from 'react'
import AdminFacilities from './components/AdminFacilities'
import EmployeeReportActions from './components/EmployeeReportActions'
import AppHeader from './components/AppHeader'
import { apiFetch } from './utils/apiFetch'
import './index.css'

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user')

    if (!savedUser) return null

    try {
      return JSON.parse(savedUser)
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })

  const handleEmployeeNavigate = async (view) => {
    if (view === 'dashboard') {
      setEmployeeView('dashboard')
      return
    }

    if (view === 'create-report') {
      await handleShowCreateReport()
      return
    }

    if (view === 'my-reports') {
      await handleShowMyReports()
      return
    }

    if (view === 'facilities') {
      await handleShowFacilities()
    }
  }

  const handleAdminNavigate = async (view) => {
    if (view === 'dashboard') {
      setAdminView('dashboard')
      return
    }

    if (view === 'reports') {
      await handleShowAdminReports()
      return
    }

    if (view === 'facilities') {
      setAdminView('facilities')
    }
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // =========================================
  // EMPLOYEE STATE
  // =========================================

  const [employeeView, setEmployeeView] = useState('dashboard')

  const [facilities, setFacilities] = useState([])
  const [facilitiesLoading, setFacilitiesLoading] = useState(false)
  const [facilitiesError, setFacilitiesError] = useState('')

  const [reportFacilityId, setReportFacilityId] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [reportPriority, setReportPriority] = useState('medium')
  const [reportPhoto, setReportPhoto] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportMessage, setReportMessage] = useState('')
  const [reportError, setReportError] = useState('')

  const [reports, setReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportsError, setReportsError] = useState('')

  const [selectedReport, setSelectedReport] = useState(null)
  const [reportDetailLoading, setReportDetailLoading] = useState(false)
  const [reportDetailError, setReportDetailError] = useState('')

  const photoInputRef = useRef(null)

  // =========================================
  // ADMIN STATE
  // =========================================

  const [adminView, setAdminView] = useState('dashboard')

  const [adminDashboard, setAdminDashboard] = useState(null)
  const [adminDashboardLoading, setAdminDashboardLoading] =
    useState(false)
  const [adminDashboardError, setAdminDashboardError] =
    useState('')

  const [adminReports, setAdminReports] = useState([])
  const [adminReportsLoading, setAdminReportsLoading] =
    useState(false)
  const [adminReportsError, setAdminReportsError] = useState('')

  const [selectedAdminReport, setSelectedAdminReport] =
    useState(null)
  const [adminDetailLoading, setAdminDetailLoading] =
    useState(false)
  const [adminDetailError, setAdminDetailError] = useState('')

  const [adminStatusNote, setAdminStatusNote] = useState('')
  const [adminStatusLoading, setAdminStatusLoading] =
    useState(false)
  const [adminStatusMessage, setAdminStatusMessage] =
    useState('')
  const [adminStatusError, setAdminStatusError] = useState('')

  // =========================================
  // HELPER
  // =========================================

  const getStatusLabel = (status) => {
    const labels = {
      reported: 'Dilaporkan',
      processing: 'Diproses',
      repaired: 'Diperbaiki',
      completed: 'Selesai',
    }

    return labels[status] || status
  }

  const getPriorityLabel = (priority) => {
    const labels = {
      low: 'Rendah',
      medium: 'Sedang',
      high: 'Tinggi',
    }

    return labels[priority] || priority
  }

  const getNextStatus = (status) => {
    const next = {
      reported: 'processing',
      processing: 'repaired',
      repaired: 'completed',
      completed: null,
    }

    return next[status] ?? null
  }

  const formatDate = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleString('id-ID')
  }

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login gagal')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setCurrentUser(data.user)
      setEmployeeView('dashboard')
      setAdminView('dashboard')
      setPassword('')
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  // =========================================
  // FASILITAS EMPLOYEE
  // =========================================

  const loadFacilities = async () => {
    const token = localStorage.getItem('token')

    setFacilitiesLoading(true)
    setFacilitiesError('')

    try {
      const response = await apiFetch(
        'http://127.0.0.1:8000/api/facilities',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setFacilitiesError(
          data.message || 'Gagal mengambil data fasilitas',
        )
        return
      }

      setFacilities(data.data)
    } catch {
      setFacilitiesError('Tidak dapat terhubung ke server')
    } finally {
      setFacilitiesLoading(false)
    }
  }

  const handleShowFacilities = async () => {
    setEmployeeView('facilities')
    await loadFacilities()
  }

  const handleShowCreateReport = async () => {
    setEmployeeView('create-report')
    setReportMessage('')
    setReportError('')
    await loadFacilities()
  }

  // =========================================
  // BUAT LAPORAN
  // =========================================

  const handleCreateReport = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem('token')

    setReportLoading(true)
    setReportMessage('')
    setReportError('')

    try {
      const formData = new FormData()

      formData.append('facility_id', reportFacilityId)
      formData.append('description', reportDescription)
      formData.append('priority', reportPriority)

      if (reportPhoto) {
        formData.append('photo', reportPhoto)
      }

      const response = await apiFetch(
        'http://127.0.0.1:8000/api/reports',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: formData,
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setReportError(data.message || 'Laporan gagal dibuat')
        return
      }

      setReportMessage('Laporan berhasil dibuat')
      setReportFacilityId('')
      setReportDescription('')
      setReportPriority('medium')
      setReportPhoto(null)

      if (photoInputRef.current) {
        photoInputRef.current.value = ''
      }
    } catch {
      setReportError('Tidak dapat terhubung ke server')
    } finally {
      setReportLoading(false)
    }
  }

  // =========================================
  // LAPORAN EMPLOYEE
  // =========================================

  const loadMyReports = async () => {
    const token = localStorage.getItem('token')

    setReportsLoading(true)
    setReportsError('')

    try {
      const response = await apiFetch(
        'http://127.0.0.1:8000/api/reports',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setReportsError(data.message || 'Gagal mengambil laporan')
        return
      }

      setReports(data.data)
    } catch {
      setReportsError('Tidak dapat terhubung ke server')
    } finally {
      setReportsLoading(false)
    }
  }

  const handleShowMyReports = async () => {
    setEmployeeView('my-reports')
    setSelectedReport(null)
    await loadMyReports()
  }

  const handleShowReportDetail = async (reportId) => {
    const token = localStorage.getItem('token')

    setEmployeeView('report-detail')
    setReportDetailLoading(true)
    setReportDetailError('')
    setSelectedReport(null)

    try {
      const response = await apiFetch(
        `http://127.0.0.1:8000/api/reports/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setReportDetailError(
          data.message || 'Gagal mengambil detail laporan',
        )
        return
      }

      setSelectedReport(data.data)
    } catch {
      setReportDetailError('Tidak dapat terhubung ke server')
    } finally {
      setReportDetailLoading(false)
    }
  }

  // =========================================
  // DASHBOARD ADMIN
  // =========================================

  const loadAdminDashboard = async () => {
    const token = localStorage.getItem('token')

    setAdminDashboardLoading(true)
    setAdminDashboardError('')

    try {
      const response = await apiFetch(
        'http://127.0.0.1:8000/api/admin/dashboard',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setAdminDashboardError(
          data.message || 'Gagal mengambil dashboard',
        )
        return
      }

      setAdminDashboard(data.data)
    } catch {
      setAdminDashboardError('Tidak dapat terhubung ke server')
    } finally {
      setAdminDashboardLoading(false)
    }
  }

  const handleShowAdminDashboard = async () => {
    setAdminView('dashboard')
    await loadAdminDashboard()
  }

  useEffect(() => {
    if (
      currentUser?.role === 'admin' &&
      adminView === 'dashboard'
    ) {
      loadAdminDashboard()
    }
  }, [currentUser, adminView])

  // =========================================
  // SEMUA LAPORAN ADMIN
  // =========================================

  const loadAdminReports = async () => {
    const token = localStorage.getItem('token')

    setAdminReportsLoading(true)
    setAdminReportsError('')

    try {
      const response = await apiFetch(
        'http://127.0.0.1:8000/api/admin/reports',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setAdminReportsError(
          data.message || 'Gagal mengambil semua laporan',
        )
        return
      }

      setAdminReports(data.data)
    } catch {
      setAdminReportsError('Tidak dapat terhubung ke server')
    } finally {
      setAdminReportsLoading(false)
    }
  }

  const handleShowAdminReports = async () => {
    setAdminView('reports')
    await loadAdminReports()
  }

  const handleShowAdminReportDetail = async (reportId) => {
    const token = localStorage.getItem('token')

    setAdminView('report-detail')
    setAdminDetailLoading(true)
    setAdminDetailError('')
    setAdminStatusMessage('')
    setAdminStatusError('')
    setAdminStatusNote('')
    setSelectedAdminReport(null)

    try {
      const response = await apiFetch(
        `http://127.0.0.1:8000/api/admin/reports/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setAdminDetailError(
          data.message || 'Gagal mengambil detail laporan',
        )
        return
      }

      setSelectedAdminReport(data.data)
    } catch {
      setAdminDetailError('Tidak dapat terhubung ke server')
    } finally {
      setAdminDetailLoading(false)
    }
  }

  // =========================================
  // UPDATE STATUS ADMIN
  // =========================================

  const handleAdminUpdateStatus = async () => {
    if (!selectedAdminReport) return

    const nextStatus = getNextStatus(selectedAdminReport.status)

    if (!nextStatus) return

    const token = localStorage.getItem('token')

    setAdminStatusLoading(true)
    setAdminStatusMessage('')
    setAdminStatusError('')

    try {
      const response = await apiFetch(
        `http://127.0.0.1:8000/api/admin/reports/${selectedAdminReport.id}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: nextStatus,
            note: adminStatusNote || null,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setAdminStatusError(
          data.message || 'Status gagal diperbarui',
        )
        return
      }

      setSelectedAdminReport(data.data)
      setAdminStatusMessage('Status laporan berhasil diperbarui')
      setAdminStatusNote('')

      setAdminReports((oldReports) =>
        oldReports.map((report) =>
          report.id === data.data.id
            ? { ...report, status: data.data.status }
            : report,
        ),
      )
    } catch {
      setAdminStatusError('Tidak dapat terhubung ke server')
    } finally {
      setAdminStatusLoading(false)
    }
  }

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {
    const token = localStorage.getItem('token')

    try {
      if (token) {
        await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
      }
    } catch (logoutError) {
      console.error(logoutError)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      setCurrentUser(null)
      setEmail('')
      setPassword('')
      setError('')

      setEmployeeView('dashboard')
      setAdminView('dashboard')

      setFacilities([])
      setReports([])
      setSelectedReport(null)

      setAdminDashboard(null)
      setAdminReports([])
      setSelectedAdminReport(null)
    }
  }

  // =========================================
  // ADMIN - KELOLA FASILITAS
  // =========================================

  if (
    currentUser?.role === 'admin' &&
    adminView === 'facilities'
  ) {
    return (
      <div className="dashboard-page">
        <AppHeader
          user={currentUser}
          title="Kelola Fasilitas"
          onLogout={handleLogout}
          onNavigate={handleAdminNavigate}
        />

        <AdminFacilities
          onBack={() => setAdminView('dashboard')}
        />
      </div>
    )
  }

  // =========================================
  // ADMIN - DETAIL LAPORAN
  // =========================================

  if (
    currentUser?.role === 'admin' &&
    adminView === 'report-detail'
  ) {
    const nextStatus = selectedAdminReport
      ? getNextStatus(selectedAdminReport.status)
      : null

    return (
      <div className="dashboard-page">
        <AppHeader
          user={currentUser}
          title="Detail Laporan Admin"
          onLogout={handleLogout}
          onNavigate={handleAdminNavigate}
        />

        <main className="dashboard-content">
          <button
            className="back-button"
            onClick={() => setAdminView('reports')}
          >
            ← Kembali ke Semua Laporan
          </button>

          {adminDetailLoading && <p>Memuat laporan...</p>}

          {adminDetailError && (
            <div className="message error-message">
              {adminDetailError}
            </div>
          )}

          {selectedAdminReport && (
            <>
              <div className="report-detail-card">
                <div className="report-detail-header">
                  <div>
                    <h2>{selectedAdminReport.facility?.name}</h2>
                    <p>Laporan #{selectedAdminReport.id}</p>
                  </div>

                  <span
                    className={`status-badge status-${selectedAdminReport.status}`}
                  >
                    {getStatusLabel(selectedAdminReport.status)}
                  </span>
                </div>

                <div className="report-detail-grid">
                  <div>
                    <strong>Pelapor</strong>
                    <p>{selectedAdminReport.user?.name}</p>
                  </div>

                  <div>
                    <strong>Email</strong>
                    <p>{selectedAdminReport.user?.email}</p>
                  </div>

                  <div>
                    <strong>Lokasi</strong>
                    <p>{selectedAdminReport.facility?.location}</p>
                  </div>

                  <div>
                    <strong>Kategori</strong>
                    <p>{selectedAdminReport.facility?.category}</p>
                  </div>

                  <div>
                    <strong>Prioritas</strong>
                    <p>
                      {getPriorityLabel(
                        selectedAdminReport.priority,
                      )}
                    </p>
                  </div>

                  <div>
                    <strong>Tanggal</strong>
                    <p>
                      {formatDate(selectedAdminReport.created_at)}
                    </p>
                  </div>
                </div>

                <div className="report-description">
                  <strong>Deskripsi</strong>
                  <p>{selectedAdminReport.description}</p>
                </div>

                {selectedAdminReport.photo && (
                  <div className="report-photo-section">
                    <strong>Foto Kerusakan</strong>

                    <img
                      className="report-photo"
                      src={`http://127.0.0.1:8000/storage/${selectedAdminReport.photo}`}
                      alt="Foto kerusakan"
                    />
                  </div>
                )}
              </div>

              <div className="admin-status-card">
                <h3>Proses Laporan</h3>

                {adminStatusMessage && (
                  <div className="message success-message">
                    {adminStatusMessage}
                  </div>
                )}

                {adminStatusError && (
                  <div className="message error-message">
                    {adminStatusError}
                  </div>
                )}

                {nextStatus ? (
                  <>
                    <p className="status-transition-text">
                      Status saat ini:
                      {' '}
                      <strong>
                        {getStatusLabel(selectedAdminReport.status)}
                      </strong>
                    </p>

                    <p className="status-transition-text">
                      Status berikutnya:
                      {' '}
                      <strong>
                        {getStatusLabel(nextStatus)}
                      </strong>
                    </p>

                    <div className="form-group">
                      <label htmlFor="admin-note">
                        Catatan Admin
                      </label>

                      <textarea
                        id="admin-note"
                        rows="4"
                        placeholder="Contoh: Laporan sedang diperiksa oleh teknisi..."
                        value={adminStatusNote}
                        onChange={(event) =>
                          setAdminStatusNote(event.target.value)
                        }
                      />
                    </div>

                    <button
                      className="submit-report-button"
                      onClick={handleAdminUpdateStatus}
                      disabled={adminStatusLoading}
                    >
                      {adminStatusLoading
                        ? 'Memperbarui...'
                        : `Ubah ke ${getStatusLabel(nextStatus)}`}
                    </button>
                  </>
                ) : (
                  <div className="completed-box">
                    Laporan sudah selesai dan tidak dapat diubah lagi.
                  </div>
                )}
              </div>

              <div className="history-card">
                <h3>Riwayat Status</h3>

                <div className="history-list">
                  {selectedAdminReport.status_histories?.map(
                    (history) => (
                      <div className="history-item" key={history.id}>
                        <div className="history-marker" />

                        <div className="history-content">
                          <div className="history-top">
                            <strong>
                              {getStatusLabel(history.status)}
                            </strong>

                            <span>
                              {formatDate(history.created_at)}
                            </span>
                          </div>

                          {history.note && <p>{history.note}</p>}

                          {history.changed_by_user && (
                            <small>
                              Oleh: {history.changed_by_user.name}
                            </small>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    )
  }

  // =========================================
  // ADMIN - SEMUA LAPORAN
  // =========================================

  if (
    currentUser?.role === 'admin' &&
    adminView === 'reports'
  ) {
    return (
      <div className="dashboard-page">
        <AppHeader
          user={currentUser}
          title="Semua Laporan"
          onLogout={handleLogout}
          onNavigate={handleAdminNavigate}
        />

        <main className="dashboard-content">
          <button
            className="back-button"
            onClick={handleShowAdminDashboard}
          >
            ← Kembali ke Dashboard
          </button>

          <h2>Semua Laporan</h2>

          <p className="dashboard-description">
            Daftar laporan dari seluruh karyawan.
          </p>

          {adminReportsLoading && <p>Memuat laporan...</p>}

          {adminReportsError && (
            <div className="message error-message">
              {adminReportsError}
            </div>
          )}

          {!adminReportsLoading &&
            !adminReportsError &&
            adminReports.length === 0 && (
              <div className="empty-card">
                Belum ada laporan.
              </div>
            )}

          <div className="reports-list">
            {adminReports.map((report) => (
              <div className="report-list-card" key={report.id}>
                <div className="report-list-header">
                  <div>
                    <h3>{report.facility?.name}</h3>

                    <small>
                      Laporan #{report.id} • {report.user?.name}
                    </small>
                  </div>

                  <span
                    className={`status-badge status-${report.status}`}
                  >
                    {getStatusLabel(report.status)}
                  </span>
                </div>

                <p className="report-list-description">
                  {report.description}
                </p>

                <div className="report-list-info">
                  <span>
                    <strong>Prioritas:</strong>{' '}
                    {getPriorityLabel(report.priority)}
                  </span>

                  <span>
                    <strong>Tanggal:</strong>{' '}
                    {formatDate(report.created_at)}
                  </span>
                </div>

                <button
                  className="card-button"
                  onClick={() =>
                    handleShowAdminReportDetail(report.id)
                  }
                >
                  Lihat & Proses
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // =========================================
  // ADMIN - DASHBOARD
  // =========================================

  if (currentUser?.role === 'admin') {
    return (
      <div className="dashboard-page">
        <AppHeader
          user={currentUser}
          title="Dashboard Admin"
          onLogout={handleLogout}
          onNavigate={handleAdminNavigate}
        />

        <main className="dashboard-content">
          <div className="admin-title-row">
            <div>
              <h2>Dashboard Admin</h2>
              <p className="dashboard-description">
                Ringkasan kondisi laporan fasilitas perusahaan.
              </p>
            </div>

            <div className="admin-actions">
              <button
                className="card-button"
                onClick={handleShowAdminReports}
              >
                Semua Laporan
              </button>

              <button
                className="card-button"
                onClick={() => setAdminView('facilities')}
              >
                Kelola Fasilitas
              </button>
            </div>
          </div>

          {adminDashboardError && (
            <div className="message error-message">
              {adminDashboardError}
            </div>
          )}

          {adminDashboardLoading && (
            <div className="empty-card">
              <p>Memuat data dashboard...</p>
            </div>
          )}

          {adminDashboard && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <span>Total Laporan</span>
                  <strong>{adminDashboard.total_reports}</strong>
                </div>

                <div className="stat-card">
                  <span>Dilaporkan</span>
                  <strong>{adminDashboard.status.reported}</strong>
                </div>

                <div className="stat-card">
                  <span>Diproses</span>
                  <strong>{adminDashboard.status.processing}</strong>
                </div>

                <div className="stat-card">
                  <span>Diperbaiki</span>
                  <strong>{adminDashboard.status.repaired}</strong>
                </div>

                <div className="stat-card">
                  <span>Selesai</span>
                  <strong>{adminDashboard.status.completed}</strong>
                </div>

                <div className="stat-card">
                  <span>Fasilitas Aktif</span>
                  <strong>{adminDashboard.active_facilities}</strong>
                </div>
              </div>

              <section className="admin-section">
                <h3>Laporan Berdasarkan Prioritas</h3>

                <div className="priority-grid">
                  <div className="priority-card priority-low">
                    <span>Rendah</span>
                    <strong>{adminDashboard.priority.low}</strong>
                  </div>

                  <div className="priority-card priority-medium">
                    <span>Sedang</span>
                    <strong>{adminDashboard.priority.medium}</strong>
                  </div>

                  <div className="priority-card priority-high">
                    <span>Tinggi</span>
                    <strong>{adminDashboard.priority.high}</strong>
                  </div>
                </div>
              </section>

              <section className="admin-section">
                <h3>Laporan Terbaru</h3>

                <div className="admin-report-table-wrapper">
                  <table className="admin-report-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Karyawan</th>
                        <th>Fasilitas</th>
                        <th>Prioritas</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {adminDashboard.recent_reports?.map(
                        (report) => (
                          <tr key={report.id}>
                            <td>#{report.id}</td>
                            <td>{report.user?.name}</td>
                            <td>{report.facility?.name}</td>
                            <td>
                              {getPriorityLabel(report.priority)}
                            </td>
                            <td>
                              <span
                                className={`status-badge status-${report.status}`}
                              >
                                {getStatusLabel(report.status)}
                              </span>
                            </td>
                            <td>
                              {formatDate(report.created_at)}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    )
  }

  // =========================================
  // EMPLOYEE - DETAIL LAPORAN
  // =========================================

  if (
    currentUser?.role === 'employee' &&
    employeeView === 'report-detail'
  ) {
    return (
      <div className="dashboard-page">
        <AppHeader
          user={currentUser}
          title="Detail Laporan"
          onLogout={handleLogout}
          onNavigate={handleEmployeeNavigate}
        />

        <main className="dashboard-content">
          <button
            className="back-button"
            onClick={() => setEmployeeView('my-reports')}
          >
            ← Kembali ke Laporan Saya
          </button>

          {reportDetailLoading && <p>Memuat detail laporan...</p>}

          {reportDetailError && (
            <div className="message error-message">
              {reportDetailError}
            </div>
          )}

          {selectedReport && (
            <>
              <div className="report-detail-card">
                <div className="report-detail-header">
                  <div>
                    <h2>{selectedReport.facility?.name}</h2>
                    <p>Laporan #{selectedReport.id}</p>
                  </div>

                  <span
                    className={`status-badge status-${selectedReport.status}`}
                  >
                    {getStatusLabel(selectedReport.status)}
                  </span>
                </div>

                <div className="report-detail-grid">
                  <div>
                    <strong>Lokasi</strong>
                    <p>{selectedReport.facility?.location}</p>
                  </div>

                  <div>
                    <strong>Kategori</strong>
                    <p>{selectedReport.facility?.category}</p>
                  </div>

                  <div>
                    <strong>Prioritas</strong>
                    <p>
                      {getPriorityLabel(selectedReport.priority)}
                    </p>
                  </div>

                  <div>
                    <strong>Tanggal</strong>
                    <p>{formatDate(selectedReport.created_at)}</p>
                  </div>
                </div>

                <div className="report-description">
                  <strong>Deskripsi</strong>
                  <p>{selectedReport.description}</p>
                </div>

                {selectedReport.admin_note && (
                  <div className="report-description">
                    <strong>Catatan Admin</strong>
                    <p>{selectedReport.admin_note}</p>
                  </div>
                )}

                {selectedReport.photo && (
                  <div className="report-photo-section">
                    <strong>Foto Kerusakan</strong>
                    <img
                      className="report-photo"
                      src={`http://127.0.0.1:8000/storage/${selectedReport.photo}`}
                      alt="Foto kerusakan"
                    />
                  </div>
                )}
              </div>

              {selectedReport.status === 'reported' && (
                <EmployeeReportActions
                  report={selectedReport}
                  onUpdated={(updatedReport) => {
                    setSelectedReport(updatedReport)

                    setReports((oldReports) =>
                      oldReports.map((report) =>
                        report.id === updatedReport.id
                          ? {
                              ...report,
                              ...updatedReport,
                            }
                          : report,
                        ),
                      )
                    }}
                onDeleted={async () => {
                  setSelectedReport(null)
                  setEmployeeView('my-reports')
                  await loadMyReports()
                }}
              />
            )}

              <div className="history-card">
                <h3>Riwayat Status</h3>

                <div className="history-list">
                  {selectedReport.status_histories?.map(
                    (history) => (
                      <div className="history-item" key={history.id}>
                        <div className="history-marker" />

                        <div className="history-content">
                          <div className="history-top">
                            <strong>
                              {getStatusLabel(history.status)}
                            </strong>

                            <span>
                              {formatDate(history.created_at)}
                            </span>
                          </div>

                          {history.note && <p>{history.note}</p>}

                          {history.changed_by_user && (
                            <small>
                              Oleh: {history.changed_by_user.name}
                            </small>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    )
  }

  // =========================================
  // EMPLOYEE - LAPORAN SAYA
  // =========================================

  if (
    currentUser?.role === 'employee' &&
    employeeView === 'my-reports'
  ) {
    return (
      <div className="dashboard-page">
        <AppHeader
          user={currentUser}
          title="Laporan Saya"
          onLogout={handleLogout}
          onNavigate={handleEmployeeNavigate}
        />

        <main className="dashboard-content">
          <button
            className="back-button"
            onClick={() => setEmployeeView('dashboard')}
          >
            ← Kembali ke Dashboard
          </button>

          <h2>Laporan Saya</h2>

          <p className="dashboard-description">
            Lihat laporan yang pernah Anda kirim.
          </p>

          {reportsLoading && <p>Memuat laporan...</p>}

          {reportsError && (
            <div className="message error-message">
              {reportsError}
            </div>
          )}

          <div className="reports-list">
            {reports.map((report) => (
              <div className="report-list-card" key={report.id}>
                <div className="report-list-header">
                  <div>
                    <h3>{report.facility?.name}</h3>
                    <small>Laporan #{report.id}</small>
                  </div>

                  <span
                    className={`status-badge status-${report.status}`}
                  >
                    {getStatusLabel(report.status)}
                  </span>
                </div>

                <p className="report-list-description">
                  {report.description}
                </p>

                <div className="report-list-info">
                  <span>
                    <strong>Prioritas:</strong>{' '}
                    {getPriorityLabel(report.priority)}
                  </span>

                  <span>
                    <strong>Tanggal:</strong>{' '}
                    {formatDate(report.created_at)}
                  </span>
                </div>

                <button
                  className="card-button"
                  onClick={() =>
                    handleShowReportDetail(report.id)
                  }
                >
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // =========================================
  // EMPLOYEE - BUAT LAPORAN
  // =========================================

  if (
    currentUser?.role === 'employee' &&
    employeeView === 'create-report'
  ) {
    return (
      <div className="dashboard-page">
        <AppHeader
          user={currentUser}
          title="Buat Laporan"
          onLogout={handleLogout}
          onNavigate={handleEmployeeNavigate}
        />

        <main className="dashboard-content">
          <button
            className="back-button"
            onClick={() => setEmployeeView('dashboard')}
          >
            ← Kembali ke Dashboard
          </button>

          <h2>Buat Laporan Kerusakan</h2>

          <p className="dashboard-description">
            Isi informasi fasilitas yang mengalami masalah.
          </p>

          <div className="report-form-card">
            {reportMessage && (
              <div className="message success-message">
                {reportMessage}
              </div>
            )}

            {reportError && (
              <div className="message error-message">
                {reportError}
              </div>
            )}

            {facilitiesLoading ? (
              <p>Memuat fasilitas...</p>
            ) : (
              <form
                className="report-form"
                onSubmit={handleCreateReport}
              >
                <div className="form-group">
                  <label htmlFor="facility">Fasilitas</label>

                  <select
                    id="facility"
                    value={reportFacilityId}
                    onChange={(event) =>
                      setReportFacilityId(event.target.value)
                    }
                    required
                  >
                    <option value="">
                      -- Pilih fasilitas --
                    </option>

                    {facilities.map((facility) => (
                      <option
                        key={facility.id}
                        value={facility.id}
                      >
                        {facility.name} - {facility.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    Deskripsi Kerusakan
                  </label>

                  <textarea
                    id="description"
                    rows="5"
                    value={reportDescription}
                    onChange={(event) =>
                      setReportDescription(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Prioritas</label>

                  <select
                    id="priority"
                    value={reportPriority}
                    onChange={(event) =>
                      setReportPriority(event.target.value)
                    }
                  >
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="photo">Foto Kerusakan</label>

                  <input
                    ref={photoInputRef}
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={(event) =>
                      setReportPhoto(
                        event.target.files[0] || null,
                      )
                    }
                  />

                  <small className="form-help">
                    Foto opsional. Maksimal 8 MB.
                  </small>
                </div>

                <button
                  className="submit-report-button"
                  disabled={reportLoading}
                >
                  {reportLoading
                    ? 'Mengirim...'
                    : 'Kirim Laporan'}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    )
  }

  // =========================================
  // EMPLOYEE - FASILITAS
  // =========================================

  if (
    currentUser?.role === 'employee' &&
    employeeView === 'facilities'
  ) {
    return (
      <div className="dashboard-page">
        <AppHeader
          user={currentUser}
          title="Daftar Fasilitas"
          onLogout={handleLogout}
          onNavigate={handleEmployeeNavigate}
        />

        <main className="dashboard-content">
          <button
            className="back-button"
            onClick={() => setEmployeeView('dashboard')}
          >
            ← Kembali ke Dashboard
          </button>

          <h2>Daftar Fasilitas</h2>

          <p className="dashboard-description">
            Fasilitas perusahaan yang saat ini aktif.
          </p>

          {facilitiesLoading && <p>Memuat fasilitas...</p>}

          <div className="facility-grid">
            {facilities.map((facility) => (
              <div className="facility-card" key={facility.id}>
                <div className="facility-card-header">
                  <h3>{facility.name}</h3>
                  <span className="status-active">Aktif</span>
                </div>

                <div className="facility-info">
                  <p>
                    <strong>Lokasi:</strong> {facility.location}
                  </p>

                  <p>
                    <strong>Kategori:</strong> {facility.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // =========================================
  // EMPLOYEE - DASHBOARD
  // =========================================

  if (currentUser?.role === 'employee') {
    return (
      <div className="dashboard-page">
        <AppHeader
          user={currentUser}
          title="Dashboard Karyawan"
          onLogout={handleLogout}
          onNavigate={handleEmployeeNavigate}
        />

        <main className="dashboard-content">
          <h2>Selamat datang, {currentUser.name}</h2>

          <p className="dashboard-description">
            Laporkan kondisi fasilitas perusahaan dengan mudah.
          </p>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Buat Laporan</h3>
              <p>Laporkan fasilitas yang mengalami masalah.</p>

              <button
                className="card-button"
                onClick={handleShowCreateReport}
              >
                Buat Laporan
              </button>
            </div>

            <div className="dashboard-card">
              <h3>Laporan Saya</h3>
              <p>Lihat laporan dan perkembangan statusnya.</p>

              <button
                className="card-button"
                onClick={handleShowMyReports}
              >
                Lihat Laporan
              </button>
            </div>

            <div className="dashboard-card">
              <h3>Daftar Fasilitas</h3>
              <p>Lihat fasilitas perusahaan yang aktif.</p>

              <button
                className="card-button"
                onClick={handleShowFacilities}
              >
                Lihat Fasilitas
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // =========================================
  // LOGIN
  // =========================================

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Facility Report</h1>
          <p>Sistem Pelaporan Kondisi Fasilitas Perusahaan</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              value={email}
              placeholder="Masukkan email"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              type="password"
              id="password"
              value={password}
              placeholder="Masukkan password"
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          {error && (
            <div className="message error-message">
              {error}
            </div>
          )}

          <button
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <p className="login-footer">
          Masuk menggunakan akun karyawan atau admin
        </p>
      </div>
    </div>
  )
}

export default App