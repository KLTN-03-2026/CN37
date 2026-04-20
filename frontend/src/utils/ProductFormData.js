// utils/productFormData.js
export const ProductFormData = (data, mode) => {
  const form = new FormData();

  form.append("Name", data.name);
  form.append("Slug", data.slug);
  form.append("CategoryId", data.categoryId);
  form.append("Brand", data.brand || "");
  form.append("Description", data.description || "");
  form.append("Price", data.price);
  form.append("DiscountPrice", data.discountPrice || 0);
  form.append("IsActive", data.isActive);
  form.append("ParentCategoryId", data.parentcategoryId);

  data.specifications?.forEach((s, i) => {
    form.append(`Specifications[${i}].SpecName`, s.specName);
    form.append(`Specifications[${i}].SpecValue`, s.specValue);
  });

  data.newImages?.forEach((img) => {
    form.append("NewImages", img.file);
  });

  if (mode !== "create") {
    form.append("Id", data.id);
    data.deletedImageIds?.forEach((id) => {
      form.append("DeletedImageIds", id);
    });
  }

  return form;
};