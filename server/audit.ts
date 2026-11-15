/** Helper kolom audit & soft delete (Spesifikasi §5). */
export const notDeleted = { deletedAt: null };

export const auditCreate = (userId: string) => ({ createdBy: userId, updatedBy: userId });

export const auditUpdate = (userId: string) => ({ updatedBy: userId });

export const auditDelete = (userId: string) => ({
  deletedAt: new Date(),
  deletedBy: userId,
  updatedBy: userId,
});
