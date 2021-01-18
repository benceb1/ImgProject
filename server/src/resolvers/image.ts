import {
  Arg,
  Field,
  Mutation,
  Resolver,
  ObjectType,
  Query,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import * as fs from "fs";
import * as path from "path";
import { generateId } from "../utils/generateId";
import { Image } from "../entity/Image";
import { User } from "../entity/User";
import { MyContext } from "../utils/types";
import { isAuth } from "../isAuthMiddleware";

@ObjectType()
class ImgResponse {
  @Field()
  url: string;
}
@Resolver()
export class ImageResolver {
  @Query(() => [Image], { nullable: true })
  @UseMiddleware(isAuth)
  async images(@Ctx() { payload }: MyContext) {
    const user = await User.findOne(payload.userId);
    const images = await user.images;
    return images;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteImage(@Arg("imageId") imageId: string) {
    const image = await Image.findOne(imageId);

    const urlParts = image.url.split("/");
    const filename = urlParts[urlParts.length - 1];

    const filePath = path.join(process.cwd(), `/public/images/${filename}`);

    try {
      await image.remove();
      await fs.unlinkSync(filePath);
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  @Mutation(() => ImgResponse)
  @UseMiddleware(isAuth)
  async uploadImage(
    @Arg("file", () => GraphQLUpload)
    file: FileUpload,
    @Arg("description") description: string,
    @Ctx() { payload, req }: MyContext
  ) {
    const user = await User.findOne(payload.userId);

    const { createReadStream, filename } = await file;
    const { ext } = path.parse(filename);
    const randomName = generateId(10) + ext;
    const stream = createReadStream();

    const filePath = path.join(process.cwd(), `/public/images/${randomName}`);

    const fileUrl =
      req.protocol + "://" + req.get("host") + `/images/${randomName}`;

    try {
      await stream.pipe(fs.createWriteStream(filePath, { autoClose: true }));
      let img = Image.create({
        url: fileUrl,
        description: description,
      });
      img.user = Promise.resolve(user);
      img.save();
    } catch (error) {
      console.log(error);
      return { url: "" };
    }
    return { url: fileUrl };
  }
}
