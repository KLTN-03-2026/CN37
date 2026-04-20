// hooks/useProductForm.js
import { useState, useEffect } from "react";
import { ProductValidator } from "../utils/ProductValidator";
import { ProductFormData } from "../utils/ProductFormData";
import { notifyError } from "../components/Nofitication";

export const useProductForm = (product, mode, onCreate, onEdit) => {
  const defaultProduct = {
    id: "",
    name: "",
    slug: "",
    parentcategoryId: "",
    categoryId: "",
    brand: "",
    description: "",
    price: 0,
    discountPrice: 0,
    isActive: true,
    images: [],
    specifications: [],
    newImages: [],
    deletedImageIds: [],
  };

  const [formData, setFormData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (mode === "create") {
      setFormData(defaultProduct);
      setIsEditMode(true);
    } else if (product) {
      setFormData({
        ...product,
        newImages: [],
        deletedImageIds: [],
      });
    }
  }, [product, mode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleSubmit = async () => {
    const error = ProductValidator(formData);
    if (error) return notifyError(error);

    const form = ProductFormData(formData, mode);

    if (mode === "create") {
      await onCreate(form);
    } else {
      await onEdit(formData.id, form);
    }

    setIsEditMode(false);
  };

  return {
    formData,
    setFormData,
    isEditMode,
    handleChange,
    toggleEdit,
    handleSubmit,
  };
};