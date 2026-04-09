/**
 * Cloudinary Image Upload Utility
 * Handles image uploads to Cloudinary and returns optimized URLs
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_preset';

export const uploadImageToCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'pohela-boishak');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.error?.message || `Cloudinary upload failed (${response.status})`;
            throw new Error(errorMsg);
        }

        const data = await response.json();

        return {
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
        };
    } catch (error) {
        console.error('Image upload error:', error);
        throw error;
    }
};

/**
 * Generate optimized Cloudinary URL with transformations
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
    const {
        width = 400,
        height = 400,
        quality = 'auto',
        fetch_format = 'auto',
    } = options;

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill,q_${quality},f_${fetch_format}/${publicId}`;
};

/**
 * Generate thumbnail URL
 */
export const getThumbnailUrl = (publicId) => {
    return getOptimizedImageUrl(publicId, {
        width: 150,
        height: 150,
        quality: 'auto',
    });
};
