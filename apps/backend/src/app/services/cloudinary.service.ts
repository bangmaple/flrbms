import {Injectable, OnModuleInit} from "@nestjs/common";
import * as Cloudinary from "cloudinary";
import * as streamifier from "streamifier";
import {environment} from "../../environments/environment";

const cloudinary = Cloudinary.v2;
const cloudinaryUploader = cloudinary.uploader;

@Injectable()
export class CloudinaryService implements OnModuleInit {

  onModuleInit() {
    cloudinary.config({
      api_key: environment.cloudinary.apiKey,
      api_secret: environment.cloudinary.apiSecret,
      cloud_name: environment.cloudinary.name,
      secure: environment.cloudinary.secure
    });
  }

  async uploadImageAndGetURL(imagePayload: Buffer, id: string): Promise<string> {
    const uploadResult = await cloudinaryUploader.upload_stream({
      access_mode: "public",
      use_filename: true,
      unique_filename: false,
      filename_override: id,
      folder: "accountsAvatar",
      async: true,
      overwrite: true
    }, (err, result) => {
      return result.url;
    });
    await streamifier.createReadStream(imagePayload).pipe(uploadResult);
    return id;
  }

  async getImageURLByFileName(id: string): Promise<string> {
    const data = cloudinary.url(id);
    const url = data.substring(0, data.lastIndexOf("/") + 1);

    const fileName = data.substring(data.lastIndexOf("/") + 1, data.length);
    return url + "accountsAvatar/" + fileName;
  }
}
