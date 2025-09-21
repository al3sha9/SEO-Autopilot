import { UTApi } from "uploadthing/server";

// Initialize UploadThing API
const utapi = new UTApi();

/**
 * Upload an image buffer to UploadThing using the server API
 * @param imageBuffer - The image buffer to upload
 * @param filename - The filename for the uploaded image
 * @returns Promise<string> - The URL of the uploaded image
 */
export async function uploadImageToUploadThing(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  try {
    console.log(`📤 Uploading image to UploadThing: ${filename}`);
    
    // Create a File object from the buffer
    const file = new File([imageBuffer], filename, { type: 'image/jpeg' });
    
    // Upload the file using UTApi - v7+ approach
    const uploadResult = await utapi.uploadFiles(file);
    
    console.log('📤 Upload result:', JSON.stringify(uploadResult, null, 2));
    
    // In v7+, the result structure is different - check for data property
    if (!uploadResult || !uploadResult.data) {
      console.error('❌ No data returned from UploadThing');
      throw new Error('Upload failed: No data returned from UploadThing');
    }
    
    const result = uploadResult.data;
    
    // Use ufsUrl (recommended) or fallback to url
    const imageUrl = result.ufsUrl || result.url;
    
    if (!imageUrl) {
      console.error('❌ No URL in result:', result);
      throw new Error('Upload failed: No URL returned from UploadThing');
    }
    
    console.log(`✅ Image uploaded successfully: ${imageUrl}`);
    
    return imageUrl;
    
  } catch (error) {
    console.error('❌ Error uploading to UploadThing:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete an image from UploadThing
 * @param imageUrl - The URL of the image to delete
 * @returns Promise<boolean> - Whether the deletion was successful
 */
export async function deleteImageFromUploadThing(imageUrl: string): Promise<boolean> {
  try {
    // Extract the file key from the URL
    const url = new URL(imageUrl);
    const fileKey = url.pathname.split('/').pop();
    
    if (!fileKey) {
      throw new Error('Invalid image URL: Could not extract file key');
    }
    
    console.log(`🗑️ Deleting image from UploadThing: ${fileKey}`);
    
    await utapi.deleteFiles(fileKey);
    
    console.log(`✅ Image deleted successfully: ${fileKey}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error deleting from UploadThing:', error);
    return false;
  }
}
