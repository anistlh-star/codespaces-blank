//ecommerce/frontend/src/pages/AdminPages/CategoryComponents/EditCategoryPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from "../../../../api/index.js";
import '../../../../styles/pages/AdminPages/CategoryComponents/EditCategoryPage.css';

export default function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', description: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
const res = await API.get(`/categories/${id}`);
        const cat = res.data.category || res.data;
        setForm({ name: cat.name || '', description: cat.description || '' });
        setImagePreview(cat.image || '');
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load category' });
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: 'Category name is required' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description || '');

      if (newImage) {
        formData.append('image', newImage);
      }

await API.put(`/categories/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

      setMessage({ type: 'success', text: 'Category updated successfully!' });
      setTimeout(() => navigate('/admin/category'), 1400);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update category'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-category-page">
      <h1>Edit Category</h1>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label>Category Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-group image-group">
          <label>Category Image</label>
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              {newImage && <small>(New image selected)</small>}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="image-upload"
          />
          <label htmlFor="image-upload" className="file-label">
            {newImage ? 'Change Image' : 'Select Image'}
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn cancel"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn save"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}