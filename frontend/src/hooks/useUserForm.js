// hooks/useUserForm.js
import { useState, useEffect } from "react";

export function useUserForm(user, onEdit, onAssignRole) {
  const [formData, setFormData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const toggleEdit = () => setIsEditMode(!isEditMode);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onEdit(formData.id, {
        fullName: formData.fullName,
        phone: formData.phone,
        isActive: formData.isActive,
      });
      setIsEditMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (roleId) => {
    await onAssignRole(formData.id, roleId);
  };

  return {
    formData,
    setFormData,
    isEditMode,
    toggleEdit,
    handleChange,
    handleSubmit,
    activeTab,
    setActiveTab,
    loading,
    handleAssignRole,
  };
}