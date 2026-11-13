
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = (
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
).replace(/\/$/, '');

const CATEGORIES = [
  'Style Tips',
  'New Arrivals',
  'Festive Fashion',
  'Trends',
  'COFIA Stories',
];

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Style Tips',
  author: 'COFIA Editorial Team',
  status: 'draft',
};

const Journal = ({ token: propToken }) => {
  const token = propToken || localStorage.getItem('token') || '';

  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [coverImage, setCoverImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/blog/admin/list`,
        { headers: { token } }
      );

      if (response.data.success) {
        setArticles(
          Array.isArray(response.data.blogs)
            ? response.data.blogs
            : []
        );
      } else {
        toast.error(
          response.data.message || 'Unable to load articles.'
        );
      }
    } catch (error) {
      console.error('Load journal articles:', error);
      toast.error(
        error.response?.data?.message ||
          'Unable to load journal articles.'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setCoverImage(null);
    setEditingId(null);

    const input = document.getElementById('journal-cover-image');
    if (input) input.value = '';
  };

  const editArticle = (article) => {
    setEditingId(article._id);

    setForm({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'Style Tips',
      author: article.author || 'COFIA Editorial Team',
      status: article.status || 'draft',
    });

    setCoverImage(null);

    document.getElementById('journal-editor')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const submitArticle = async (event) => {
    event.preventDefault();

    if (!editingId && !coverImage) {
      toast.error('Please select a cover image.');
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('excerpt', form.excerpt.trim());
      formData.append('content', form.content);
      formData.append('category', form.category);
      formData.append(
        'author',
        form.author.trim() || 'COFIA Editorial Team'
      );
      formData.append('status', form.status);

      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      const endpoint = editingId
        ? `${API_URL}/api/blog/update/${editingId}`
        : `${API_URL}/api/blog/add`;

      const response = editingId
        ? await axios.put(endpoint, formData, {
            headers: { token },
          })
        : await axios.post(endpoint, formData, {
            headers: { token },
          });

      if (!response.data.success) {
        toast.error(
          response.data.message || 'Unable to save article.'
        );
        return;
      }

      toast.success(
        response.data.message ||
          (editingId ? 'Article updated.' : 'Article created.')
      );

      resetForm();
      await loadArticles();
    } catch (error) {
      console.error('Save journal article:', error);
      toast.error(
        error.response?.data?.message ||
          'Unable to save article. Check your login and backend.'
      );
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (article) => {
    const newStatus =
      article.status === 'published' ? 'draft' : 'published';

    const formData = new FormData();
    formData.append('status', newStatus);

    try {
      const response = await axios.put(
        `${API_URL}/api/blog/update/${article._id}`,
        formData,
        { headers: { token } }
      );

      if (!response.data.success) {
        toast.error(
          response.data.message || 'Unable to update status.'
        );
        return;
      }

      toast.success(
        newStatus === 'published'
          ? 'Article published.'
          : 'Article moved to drafts.'
      );

      await loadArticles();
    } catch (error) {
      console.error('Change article status:', error);
      toast.error(
        error.response?.data?.message ||
          'Unable to update article status.'
      );
    }
  };

  const deleteArticle = async (article) => {
    const confirmed = window.confirm(
      `Delete "${article.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await axios.delete(
        `${API_URL}/api/blog/delete/${article._id}`,
        { headers: { token } }
      );

      if (!response.data.success) {
        toast.error(
          response.data.message || 'Unable to delete article.'
        );
        return;
      }

      toast.success('Article deleted.');

      if (editingId === article._id) {
        resetForm();
      }

      await loadArticles();
    } catch (error) {
      console.error('Delete journal article:', error);
      toast.error(
        error.response?.data?.message ||
          'Unable to delete article.'
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          COFIA Editorial
        </p>

        <h1 className="mt-2 text-3xl font-serif text-gray-900">
          Fashion Journal
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create stories, manage drafts and publish fashion inspiration.
        </p>
      </div>

      <section
        id="journal-editor"
        className="bg-white border border-gray-200 p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-medium text-gray-900">
            {editingId ? 'Edit Article' : 'Create New Article'}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm underline"
            >
              Cancel editing
            </button>
          )}
        </div>

        <form onSubmit={submitArticle} className="space-y-5">
          <div>
            <label
              htmlFor="journal-title"
              className="block mb-2 text-sm font-medium"
            >
              Article title *
            </label>

            <input
              id="journal-title"
              name="title"
              value={form.title}
              onChange={updateField}
              required
              maxLength={180}
              className="w-full border border-gray-300 px-3 py-3 outline-none focus:border-black"
              placeholder="e.g. How to Style Neutral Outfits"
            />
          </div>

          <div>
            <label
              htmlFor="journal-excerpt"
              className="block mb-2 text-sm font-medium"
            >
              Short description *
            </label>

            <textarea
              id="journal-excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={updateField}
              required
              maxLength={400}
              rows={3}
              className="w-full border border-gray-300 px-3 py-3 outline-none focus:border-black"
              placeholder="Write a short introduction for the article."
            />

            <p className="mt-1 text-xs text-gray-500">
              {form.excerpt.length}/400 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="journal-content"
              className="block mb-2 text-sm font-medium"
            >
              Article content *
            </label>

            <textarea
              id="journal-content"
              name="content"
              value={form.content}
              onChange={updateField}
              required
              rows={12}
              className="w-full border border-gray-300 px-3 py-3 outline-none focus:border-black"
              placeholder="Write your full fashion story here. Leave a blank line between paragraphs."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="journal-category"
                className="block mb-2 text-sm font-medium"
              >
                Category *
              </label>

              <select
                id="journal-category"
                name="category"
                value={form.category}
                onChange={updateField}
                className="w-full border border-gray-300 px-3 py-3 bg-white"
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="journal-author"
                className="block mb-2 text-sm font-medium"
              >
                Author
              </label>

              <input
                id="journal-author"
                name="author"
                value={form.author}
                onChange={updateField}
                maxLength={100}
                className="w-full border border-gray-300 px-3 py-3"
                placeholder="COFIA Editorial Team"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="journal-cover-image"
              className="block mb-2 text-sm font-medium"
            >
              Cover image {!editingId && '*'}
            </label>

            <input
              id="journal-cover-image"
              type="file"
              accept="image/*"
              required={!editingId}
              onChange={(event) =>
                setCoverImage(event.target.files?.[0] || null)
              }
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200"
            />

            <p className="mt-2 text-xs text-gray-500">
              Choose an image for the article cover. Uploads use your
              existing Cloudinary configuration.
            </p>

            {coverImage && (
              <p className="mt-2 text-sm text-gray-700">
                Selected: {coverImage.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="journal-status"
              className="block mb-2 text-sm font-medium"
            >
              Publication status
            </label>

            <select
              id="journal-status"
              name="status"
              value={form.status}
              onChange={updateField}
              className="w-full sm:w-64 border border-gray-300 px-3 py-3 bg-white"
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Publish Article</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 bg-black text-white text-sm disabled:opacity-60"
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'UPDATE ARTICLE'
                  : 'SAVE ARTICLE'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-7 py-3 border border-gray-300 text-sm"
              >
                CANCEL
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-xl font-medium text-gray-900">
            Manage Articles ({articles.length})
          </h2>

          <button
            type="button"
            onClick={loadArticles}
            disabled={loading}
            className="border border-gray-300 px-4 py-2 text-sm hover:border-black"
          >
            {loading ? 'Refreshing...' : 'REFRESH'}
          </button>
        </div>

        {loading && articles.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            Loading articles...
          </p>
        ) : articles.length === 0 ? (
          <div className="bg-white border border-gray-200 py-12 px-5 text-center">
            <h3 className="text-lg font-serif">No articles yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Create your first fashion story using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <article
                key={article._id}
                className="bg-white border border-gray-200 p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full sm:w-28 h-40 sm:h-32 object-cover bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 ${
                          article.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {article.status === 'published'
                          ? 'Published'
                          : 'Draft'}
                      </span>

                      <span className="text-xs text-gray-500">
                        {article.category}
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-medium text-gray-900 break-words">
                      {article.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <button
                        type="button"
                        onClick={() => editArticle(article)}
                        className="underline hover:text-black"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => changeStatus(article)}
                        className="underline hover:text-black"
                      >
                        {article.status === 'published'
                          ? 'Move to draft'
                          : 'Publish'}
                      </button>

                      {article.status === 'published' && (
                        <a
                          href={`/blog/${encodeURIComponent(article.slug)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:text-black"
                        >
                          View article
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteArticle(article)}
                        className="text-red-600 underline hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Journal;
