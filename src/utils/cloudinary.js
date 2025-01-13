import { v2 as cloudinary } from 'cloudinary'
import { log } from 'console';
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        //flie uploaded successfully
        console.log('flie is uploaded successfully in cloudinary', response.url)
        return response
    } catch (error) {
        fs.unlink(localFilePath) //remove file from local storage if it is not uploaded on cloudinary
        return null
    }
}


export {uploadOnCloudinary}