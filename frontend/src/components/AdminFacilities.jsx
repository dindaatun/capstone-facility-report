import { useEffect, useRef, useState } from 'react'

function AdminFacilities({ onBack }) {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingFacility, setEditingFacility] = useState(null)

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('active')
  const [saving, setSaving] = useState(false)

  const formRef = useRef(null)

  const token = localStorage.getItem('token')

  const loadFacilities = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/admin/facilities',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message || 'Gagal mengambil data fasilitas',
        )
        return
      }

      setFacilities(data.data)
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFacilities()
  }, [])

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [showForm, editingFacility])

  const resetForm = () => {
    setName('')
    setLocation('')
    setCategory('')
    setStatus('active')
    setEditingFacility(null)
    setShowForm(false)
  }

  const handleAdd = () => {
    setEditingFacility(null)
    setName('')
    setLocation('')
    setCategory('')
    setStatus('active')
    setMessage('')
    setError('')
    setShowForm(true)
  }

  const handleEdit = (facility) => {
    setEditingFacility(facility)

    setName(facility.name)
    setLocation(facility.location)
    setCategory(facility.category)
    setStatus(facility.status)

    setMessage('')
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setMessage('')
    setError('')

    const isEditing = Boolean(editingFacility)

    const url = isEditing
      ? `http://127.0.0.1:8000/api/facilities/${editingFacility.id}`
      : 'http://127.0.0.1:8000/api/facilities'

    try {
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          location,
          category,
          status,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message ||
            (isEditing
              ? 'Fasilitas gagal diperbarui'
              : 'Fasilitas gagal ditambahkan'),
        )
        return
      }

      setMessage(
        isEditing
          ? 'Fasilitas berhasil diperbarui'
          : 'Fasilitas berhasil ditambahkan',
      )

      resetForm()
      await loadFacilities()
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (facility) => {
    const confirmed = window.confirm(
      `Nonaktifkan fasilitas "${facility.name}"?`,
    )

    if (!confirmed) {
      return
    }

    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/facilities/${facility.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message || 'Fasilitas gagal dinonaktifkan',
        )
        return
      }

      setMessage('Fasilitas berhasil dinonaktifkan')
      await loadFacilities()
    } catch {
      setError('Tidak dapat terhubung ke server')
    }
  }

  return (
    <main className="dashboard-content">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Kembali ke Dashboard
      </button>

      <div className="admin-title-row">
        <div>
          <h2>Kelola Fasilitas</h2>

          <p className="dashboard-description">
            Tambah, edit, aktifkan, atau nonaktifkan fasilitas perusahaan.
          </p>
        </div>

        <button
          type="button"
          className="card-button"
          onClick={handleAdd}
        >
          + Tambah Fasilitas
        </button>
      </div>

      {message && (
        <div className="message success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="message error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div
          className="facility-form-card"
          ref={formRef}
        >
          <h3>
            {editingFacility
              ? `Edit Fasilitas: ${editingFacility.name}`
              : 'Tambah Fasilitas'}
          </h3>

          <form
            className="report-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="facility-name">
                Nama Fasilitas
              </label>

              <input
                id="facility-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="facility-location">
                Lokasi
              </label>

              <input
                id="facility-location"
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="facility-category">
                Kategori
              </label>

              <input
                id="facility-category"
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="facility-status">
                Status
              </label>

              <select
                id="facility-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <option value="active">
                  Aktif
                </option>

                <option value="inactive">
                  Tidak Aktif
                </option>
              </select>
            </div>

            <div className="facility-form-actions">
              <button
                type="submit"
                className="submit-report-button"
                disabled={saving}
              >
                {saving
                  ? 'Menyimpan...'
                  : editingFacility
                    ? 'Simpan Perubahan'
                    : 'Tambah Fasilitas'}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Memuat fasilitas...</p>
      ) : facilities.length === 0 ? (
        <div className="empty-card">
          Belum ada fasilitas.
        </div>
      ) : (
        <div className="admin-facility-grid">
          {facilities.map((facility) => (
            <div
              className="facility-card"
              key={facility.id}
            >
              <div className="facility-card-header">
                <div>
                  <h3>{facility.name}</h3>
                  <small>ID #{facility.id}</small>
                </div>

                <span
                  className={
                    facility.status === 'active'
                      ? 'status-active'
                      : 'status-inactive'
                  }
                >
                  {facility.status === 'active'
                    ? 'Aktif'
                    : 'Tidak Aktif'}
                </span>
              </div>

              <div className="facility-info">
                <p>
                  <strong>Lokasi:</strong>{' '}
                  {facility.location}
                </p>

                <p>
                  <strong>Kategori:</strong>{' '}
                  {facility.category}
                </p>
              </div>

              <div className="facility-actions">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() =>
                    handleEdit(facility)
                  }
                >
                  Edit
                </button>

                {facility.status === 'active' && (
                  <button
                    type="button"
                    className="deactivate-button"
                    onClick={() =>
                      handleDeactivate(facility)
                    }
                  >
                    Nonaktifkan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default AdminFacilities