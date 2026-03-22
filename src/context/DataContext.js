import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

const DataProvider = ({ children }) => {
  const { token } = useAuth();
  const [packagesDomestic, setPackagesDomestic] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [news, setNews] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [packageCategories, setPackageCategories] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [customPackages, setCustomPackages] = useState([]);
  const [cms, setCms] = useState(null);
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    totalVisitors: 0,
    popularDestinations: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setPackagesDomestic([]);
      setBlogs([]);
      setNews([]);
      setGalleryItems([]);
      setPackageCategories([]);
      setPopularPackages([]);
      setReviews([]);
      setEnquiries([]);
      setDestinations([]);
      setCustomPackages([]);
      setCms(null);
      setActivity([]);
      setStats({ totalEnquiries: 0, totalVisitors: 0, popularDestinations: [] });
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [
          domestic,
          blogsData,
          newsData,
          galleryData,
          categoriesData,
          popularData,
          reviewsData,
          enquiriesData,
          destinationsData,
          customPackagesData,
          cmsData,
          activityData,
          statsData
        ] =
          await Promise.all([
            api.get('/admin/domestic'),
            api.get('/admin/blogs'),
            api.get('/admin/news'),
            api.get('/admin/gallery'),
            api.get('/admin/package-categories'),
            api.get('/admin/popular-packages'),
            api.get('/admin/reviews'),
            api.get('/admin/enquiries'),
            api.get('/admin/destinations'),
            api.get('/admin/custom-packages'),
            api.get('/admin/cms'),
            api.get('/admin/activity'),
            api.get('/admin/stats')
          ]);

        setPackagesDomestic(domestic.data || []);
        setBlogs(blogsData.data || []);
        setNews(newsData.data || []);
        setGalleryItems(galleryData.data || []);
        setPackageCategories(categoriesData.data || []);
        setPopularPackages(popularData.data || []);
        setReviews(reviewsData.data || []);
        setEnquiries(enquiriesData.data || []);
        setDestinations(destinationsData.data || []);
        setCustomPackages(customPackagesData.data || []);
        setCms(cmsData.data || null);
        setActivity(activityData.data || []);
        setStats(statsData.data || { totalEnquiries: 0, totalVisitors: 0, popularDestinations: [] });
      } catch (error) {
        console.error('Failed to load admin data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const refreshActivity = async () => {
    try {
      const response = await api.get('/admin/activity');
      setActivity(response.data || []);
    } catch (error) {
      console.error('Failed to load activity', error);
    }
  };

  const refreshStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data || { totalEnquiries: 0, totalVisitors: 0, popularDestinations: [] });
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  };

  const buildPackageFormData = data => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('slug', data.slug || '');
    formData.append('country', data.country || '');
    formData.append('shortDescription', data.shortDescription || '');
    formData.append('description', data.description || '');
    formData.append('details', data.details || '');
    formData.append('duration', data.duration || '');
    formData.append('price', data.price || '');
    formData.append('location', data.location || '');
    formData.append('highlights', data.highlights || '');
    formData.append('itinerary', data.itinerary || '');
    formData.append('inclusions', data.inclusions || '');
    formData.append('exclusions', data.exclusions || '');
    formData.append('metaTitle', data.metaTitle || '');
    formData.append('metaDescription', data.metaDescription || '');
    formData.append('enquireEnabled', String(data.enquireEnabled));
    formData.append('isActive', String(data.isActive));
    formData.append('categoryIds', JSON.stringify(data.categoryIds || []));
    if (data.existingImages) {
      formData.append('existingImages', JSON.stringify(data.existingImages));
    }
    (data.newImages || []).forEach(file => {
      formData.append('images', file);
    });
    return formData;
  };

  const addDomesticPackage = async data => {
    try {
      const formData = buildPackageFormData(data);
      const response = await api.post('/admin/domestic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPackagesDomestic(prev => [response.data, ...prev]);
      refreshActivity();
    } catch (error) {
      console.error('❌ Error adding package:', error.response?.data || error.message);
      throw error;
    }
  };

  const updateDomesticPackage = async data => {
    try {
      const formData = buildPackageFormData(data);
      const response = await api.put(`/admin/domestic/${data.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPackagesDomestic(prev => prev.map(item => (item._id === data.id ? response.data : item)));
      refreshActivity();
    } catch (error) {
      console.error('❌ Error updating package:', error.response?.data || error.message);
      throw error;
    }
  };

  const deleteDomesticPackage = async id => {
    await api.delete(`/admin/domestic/${id}`);
    setPackagesDomestic(prev => prev.filter(item => item._id !== id));
    refreshActivity();
  };

  const toggleDomesticPackage = async id => {
    const response = await api.patch(`/admin/domestic/${id}/toggle`);
    setPackagesDomestic(prev => prev.map(item => (item._id === id ? response.data : item)));
  };

  const buildDestinationFormData = data => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug || '');
    formData.append('shortDescription', data.shortDescription || '');
    formData.append('description', data.description || '');
    formData.append('duration', data.duration || '');
    formData.append('price', data.price || '');
    formData.append('location', data.location || '');
    formData.append('highlights', data.highlights || '');
    formData.append('itinerary', data.itinerary || '');
    formData.append('inclusions', data.inclusions || '');
    formData.append('exclusions', data.exclusions || '');
    formData.append('metaTitle', data.metaTitle || '');
    formData.append('metaDescription', data.metaDescription || '');
    formData.append('enquireEnabled', String(data.enquireEnabled));
    formData.append('enquiriesCount', String(data.enquiriesCount || 0));
    formData.append('isActive', String(data.isActive));
    if (data.existingImages) {
      formData.append('existingImages', JSON.stringify(data.existingImages));
    }
    (data.newImages || []).forEach(file => {
      formData.append('images', file);
    });
    return formData;
  };

  const buildBlogFormData = data => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('content', data.content || '');
    formData.append('author', data.author || '');
    formData.append('date', data.date || '');
    formData.append('location', data.location || '');
    formData.append('metaTitle', data.metaTitle || '');
    formData.append('metaDescription', data.metaDescription || '');
    formData.append('isActive', String(data.isActive));
    if (data.existingCoverImage) {
      formData.append('existingCoverImage', data.existingCoverImage);
    }
    if (data.newCoverImage) {
      formData.append('coverImage', data.newCoverImage);
    }
    return formData;
  };

  const addBlog = async data => {
    const formData = buildBlogFormData(data);
    const response = await api.post('/admin/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setBlogs(prev => [response.data, ...prev]);
    refreshActivity();
  };

  const updateBlog = async data => {
    const formData = buildBlogFormData(data);
    const response = await api.put(`/admin/blogs/${data.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setBlogs(prev => prev.map(item => (item._id === data.id ? response.data : item)));
    refreshActivity();
  };

  const deleteBlog = async id => {
    await api.delete(`/admin/blogs/${id}`);
    setBlogs(prev => prev.filter(item => item._id !== id));
    refreshActivity();
  };

  const toggleBlog = async id => {
    const response = await api.patch(`/admin/blogs/${id}/toggle`);
    setBlogs(prev => prev.map(item => (item._id === id ? response.data : item)));
  };

  const addNews = async data => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('shortDescription', data.shortDescription || '');
    formData.append('content', data.content || '');
    formData.append('date', data.date || '');
    formData.append('isActive', String(data.isActive));
    if (data.existingImageUrl) {
      formData.append('existingImageUrl', data.existingImageUrl);
    }
    if (data.newImage) {
      formData.append('image', data.newImage);
    }
    const response = await api.post('/admin/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setNews(prev => [response.data, ...prev]);
    refreshActivity();
  };

  const updateNews = async data => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('shortDescription', data.shortDescription || '');
    formData.append('content', data.content || '');
    formData.append('date', data.date || '');
    formData.append('isActive', String(data.isActive));
    if (data.existingImageUrl) {
      formData.append('existingImageUrl', data.existingImageUrl);
    }
    if (data.newImage) {
      formData.append('image', data.newImage);
    }
    const response = await api.put(`/admin/news/${data.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setNews(prev => prev.map(item => (item._id === data.id ? response.data : item)));
    refreshActivity();
  };

  const deleteNews = async id => {
    await api.delete(`/admin/news/${id}`);
    setNews(prev => prev.filter(item => item._id !== id));
    refreshActivity();
  };

  const toggleNews = async id => {
    const response = await api.patch(`/admin/news/${id}/toggle`);
    setNews(prev => prev.map(item => (item._id === id ? response.data : item)));
  };

  const buildGalleryFormData = data => {
    const formData = new FormData();
    formData.append('title', data.title || '');
    formData.append('place', data.place || '');
    formData.append('shortDescription', data.shortDescription || '');
    formData.append('description', data.description || '');
    formData.append('isActive', String(data.isActive));
    if (data.existingMediaUrl) {
      formData.append('existingMediaUrl', data.existingMediaUrl);
    }
    if (data.existingMediaType) {
      formData.append('existingMediaType', data.existingMediaType);
    }
    if (data.newMedia) {
      if (Array.isArray(data.newMedia)) {
        data.newMedia.forEach(file => {
          formData.append('media', file);
        });
      } else {
        formData.append('media', data.newMedia);
      }
    }
    return formData;
  };

  const addGalleryItem = async data => {
    const formData = buildGalleryFormData(data);
    const response = await api.post('/admin/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const items = Array.isArray(response.data) ? response.data : [response.data];
    setGalleryItems(prev => [...items, ...prev]);
    refreshActivity();
  };

  const updateGalleryItem = async data => {
    const formData = buildGalleryFormData(data);
    const response = await api.put(`/admin/gallery/${data.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setGalleryItems(prev => prev.map(item => (item._id === data.id ? response.data : item)));
    refreshActivity();
  };

  const deleteGalleryItem = async id => {
    await api.delete(`/admin/gallery/${id}`);
    setGalleryItems(prev => prev.filter(item => item._id !== id));
    refreshActivity();
  };

  const toggleGalleryItem = async id => {
    const response = await api.patch(`/admin/gallery/${id}/toggle`);
    setGalleryItems(prev => prev.map(item => (item._id === id ? response.data : item)));
  };

  const addPackageCategory = async formData => {
    const response = await api.post('/admin/package-categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setPackageCategories(prev => [response.data, ...prev]);
    refreshActivity();
  };

  const updatePackageCategory = async ({ id, formData }) => {
    const response = await api.put(`/admin/package-categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setPackageCategories(prev => prev.map(item => (item._id === id ? response.data : item)));
    refreshActivity();
  };

  const deletePackageCategory = async id => {
    await api.delete(`/admin/package-categories/${id}`);
    setPackageCategories(prev => prev.filter(item => item._id !== id));
    refreshActivity();
  };

  const togglePackageCategory = async id => {
    const response = await api.patch(`/admin/package-categories/${id}/toggle`);
    setPackageCategories(prev => prev.map(item => (item._id === id ? response.data : item)));
  };

  const addPopularPackage = async data => {
    const response = await api.post('/admin/popular-packages', data);
    setPopularPackages(prev => [response.data, ...prev]);
    refreshActivity();
  };

  const updatePopularPackage = async data => {
    const response = await api.put(`/admin/popular-packages/${data.id}`, data);
    setPopularPackages(prev => prev.map(item => (item._id === data.id ? response.data : item)));
    refreshActivity();
  };

  const deletePopularPackage = async id => {
    await api.delete(`/admin/popular-packages/${id}`);
    setPopularPackages(prev => prev.filter(item => item._id !== id));
    refreshActivity();
  };

  const togglePopularPackage = async id => {
    const response = await api.patch(`/admin/popular-packages/${id}/toggle`);
    setPopularPackages(prev => prev.map(item => (item._id === id ? response.data : item)));
  };

  const addReview = async data => {
    const response = await api.post('/admin/reviews', data);
    setReviews(prev => [response.data, ...prev]);
    refreshActivity();
  };

  const updateReview = async data => {
    const response = await api.put(`/admin/reviews/${data.id}`, data);
    setReviews(prev => prev.map(item => (item._id === data.id ? response.data : item)));
    refreshActivity();
  };

  const deleteReview = async id => {
    await api.delete(`/admin/reviews/${id}`);
    setReviews(prev => prev.filter(item => item._id !== id));
    refreshActivity();
  };

  const toggleReview = async id => {
    const response = await api.patch(`/admin/reviews/${id}/toggle`);
    setReviews(prev => prev.map(item => (item._id === id ? response.data : item)));
  };

  const addDestination = async data => {
    const formData = buildDestinationFormData(data);
    const response = await api.post('/admin/destinations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setDestinations(prev => [response.data, ...prev]);
    refreshActivity();
    refreshStats();
  };

  const updateDestination = async data => {
    const formData = buildDestinationFormData(data);
    const response = await api.put(`/admin/destinations/${data.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setDestinations(prev => prev.map(item => (item._id === data.id ? response.data : item)));
    refreshActivity();
    refreshStats();
  };

  const deleteDestination = async id => {
    await api.delete(`/admin/destinations/${id}`);
    setDestinations(prev => prev.filter(item => item._id !== id));
    refreshActivity();
    refreshStats();
  };

  const toggleDestination = async id => {
    const response = await api.patch(`/admin/destinations/${id}/toggle`);
    setDestinations(prev => prev.map(item => (item._id === id ? response.data : item)));
  };

  const buildCustomPackageFormData = data => {
    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('isActive', String(data.isActive));
    if (data.existingImage) {
      formData.append('existingImage', data.existingImage);
    }
    if (data.newImage) {
      formData.append('image', data.newImage);
    }
    return formData;
  };

  const addCustomPackage = async data => {
    const formData = buildCustomPackageFormData(data);
    const response = await api.post('/admin/custom-packages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setCustomPackages(prev => [response.data, ...prev]);
    refreshActivity();
  };

  const updateCustomPackage = async data => {
    const formData = buildCustomPackageFormData(data);
    const response = await api.put(`/admin/custom-packages/${data.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setCustomPackages(prev => prev.map(item => (item._id === data.id ? response.data : item)));
    refreshActivity();
  };

  const deleteCustomPackage = async id => {
    await api.delete(`/admin/custom-packages/${id}`);
    setCustomPackages(prev => prev.filter(item => item._id !== id));
    refreshActivity();
  };

  const toggleCustomPackage = async id => {
    const response = await api.patch(`/admin/custom-packages/${id}/toggle`);
    setCustomPackages(prev => prev.map(item => (item._id === id ? response.data : item)));
  };

  const markEnquiryRead = async (id, isRead) => {
    const response = await api.patch(`/admin/enquiries/${id}/read`, { isRead });
    setEnquiries(prev => prev.map(item => (item._id === id ? response.data : item)));
  };

  const deleteEnquiry = async id => {
    await api.delete(`/admin/enquiries/${id}`);
    setEnquiries(prev => prev.filter(item => item._id !== id));
  };

  const saveCms = async data => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const config = isFormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined;
    const response = await api.put('/admin/cms', data, config);
    setCms(response.data);
    refreshActivity();
  };

  const unreadEnquiriesCount = enquiries.filter(item => !item.isRead).length;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(
    () => ({
      packagesDomestic,
      blogs,
      news,
      galleryItems,
      packageCategories,
      popularPackages,
      reviews,
      enquiries,
      destinations,
      customPackages,
      cms,
      activity,
      stats,
      unreadEnquiriesCount,
      loading,
      addDomesticPackage,
      updateDomesticPackage,
      deleteDomesticPackage,
      toggleDomesticPackage,
      addBlog,
      updateBlog,
      deleteBlog,
      toggleBlog,
      addNews,
      updateNews,
      deleteNews,
      toggleNews,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      toggleGalleryItem,
      addPackageCategory,
      updatePackageCategory,
      deletePackageCategory,
      togglePackageCategory,
      addPopularPackage,
      updatePopularPackage,
      deletePopularPackage,
      togglePopularPackage,
      addReview,
      updateReview,
      deleteReview,
      toggleReview,
      addDestination,
      updateDestination,
      deleteDestination,
      toggleDestination,
      addCustomPackage,
      updateCustomPackage,
      deleteCustomPackage,
      toggleCustomPackage,
      markEnquiryRead,
      deleteEnquiry,
      saveCms
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      packagesDomestic,
      blogs,
      news,
      galleryItems,
      packageCategories,
      popularPackages,
      reviews,
      enquiries,
      destinations,
      customPackages,
      cms,
      activity,
      stats,
      unreadEnquiriesCount,
      addBlog,
      addCustomPackage,
      addDestination,
      addDomesticPackage,
      addGalleryItem,
      addNews,
      addPackageCategory,
      addPopularPackage,
      addReview,
      deleteBlog,
      deleteCustomPackage,
      deleteDestination,
      deleteDomesticPackage,
      deleteGalleryItem,
      deleteNews,
      deletePackageCategory,
      deletePopularPackage,
      deleteReview,
      loading,
      saveCms,
      updateBlog,
      updateCustomPackage,
      updateDestination,
      updateDomesticPackage,
      updateGalleryItem,
      updateNews,
      updatePackageCategory,
      updatePopularPackage,
      updateReview,
      toggleBlog,
      toggleCustomPackage,
      toggleDomesticPackage,
      toggleDestination,
      toggleGalleryItem,
      toggleNews,
      togglePackageCategory,
      togglePopularPackage,
      toggleReview,
      markEnquiryRead,
      deleteEnquiry
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

const useData = () => useContext(DataContext);

export { DataProvider, useData };
