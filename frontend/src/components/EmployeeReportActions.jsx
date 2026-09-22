import { useEffect, useRef, useState } from 'react'
import { API_BASE_URL } from '../config'

function EmployeeReportActions({
  report,
  onUpdated,
  onDeleted,
}) {
  const [editing, setEditing] = useState(false)

  const [facilities, setFacilities] = useState([])
  const [facilityId, setFacilityId] = useState(
    String(report.facility_id),
  )
  const [description, setDescription] = useState(
    report.description,
  )
  const [priority, setPriority] = useState(
    report.priority,
  )
  const [photo, setPhoto] = useState(null)

  const [loadingFacilities, setLoadingFacilities] =
    useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const photoInputRef = useRef(null)

  const token = localStorage.getItem('token')

  const loadFacilities = async () => {
    setLoadingFacilities(true)
    setError('')

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facilities`,
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
          data.message ||
            'Gagal mengambil data fasilitas',
        )
        return
      }

      setFacilities(data.data)
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setLoadingFacilities(false)
    }
  }

  useEffect(() => {
    if (editing) {
      loadFacilities()
    }
  }, [editing])

  const handleStartEdit = () => {
    setFacilityId(String(report.facility_id))
    setDescription(report.description)
    setPriority(report.priority)
    setPhoto(null)
    setMessage('')
    setError('')
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
    setPhoto(null)
    setMessage('')
    setError('')

    if (photoInputRef.current) {
      photoInputRef.current.value = ''
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()

    setSaving(true)
    setMessage('')
    setError('')

    try {
      const formData = new FormData()

      formData.append('_method', 'PATCH')
      formData.append('facility_id', facilityId)
      formData.append('description', description)
      formData.append('priority', priority)

      if (photo) {
        formData.append('photo', photo)
      }

      const response = await fetch(
        `${API_BASE_URL}/api/reports/${report.id}`,
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
        setError(
          data.message ||
            'Laporan gagal diperbarui',
        )
        return
      }

      setMessage('Laporan berhasil diperbarui')
      setEditing(false)
      setPhoto(null)

      if (photoInputRef.current) {
        photoInputRef.current.value = ''
      }

      onUpdated(data.data)
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus laporan ini?',
    )

    if (!confirmed) {
      return
    }

    setDeleting(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reports/${report.id}`,
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
          data.message ||
            'Laporan gagal dihapus',
        )
        return
      }

      onDeleted()
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="employee-report-actions">
      <h3>Kelola Laporan</h3>

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

      {!editing && (
        <div className="report-action-buttons">
          <button
            type="button"
            className="edit-button"
            onClick={handleStartEdit}
          >
            Edit Laporan
          </button>

          <button
            type="button"
            className="deactivate-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting
              ? 'Menghapus...'
              : 'Hapus Laporan'}
          </button>
        </div>
      )}

      {editing && (
        <>
          {loadingFacilities ? (
            <p>Memuat fasilitas...</p>
          ) : (
            <form
              className="report-form"
              onSubmit={handleUpdate}
            >
              <div className="form-group">
                <label htmlFor="edit-facility">
                  Fasilitas
                </label>

                <select
                  id="edit-facility"
                  value={facilityId}
                  onChange={(event) =>
                    setFacilityId(
                      event.target.value,
                    )
                  }
                  required
                >
                  {facilities.map((facility) => (
                    <option
                      key={facility.id}
                      value={facility.id}
                    >
                      {facility.name} -{' '}
                      {facility.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">
                  Deskripsi
                </label>

                <textarea
                  id="edit-description"
                  rows="5"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-priority">
                  Prioritas
                </label>

                <select
                  id="edit-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value,
                    )
                  }
                  required
                >
                  <option value="low">
                    Rendah
                  </option>

                  <option value="medium">
                    Sedang
                  </option>

                  <option value="high">
                    Tinggi
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-photo">
                  Ganti Foto
                </label>

                <input
                  ref={photoInputRef}
                  id="edit-photo"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setPhoto(
                      event.target.files[0] ||
                        null,
                    )
                  }
                />

                <small className="form-help">
                  Kosongkan jika tidak ingin
                  mengganti foto. Maksimal 8 MB.
                </small>
              </div>

              <div className="facility-form-actions">
                <button
                  type="submit"
                  className="submit-report-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Menyimpan...'
                    : 'Simpan Perubahan'}
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelEdit}
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}

export default EmployeeReportActions