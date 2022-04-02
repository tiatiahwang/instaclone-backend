import bcrypt from "bcrypt";
import { createWriteStream } from "fs";
import { GraphQLUpload } from "graphql-upload";
import { protectedResolver } from "../users.utils";
import client from "../../client";

const resolverFn = async (
    _,
    { firstName, lastName, userName, email, password: newPassword, bio, avatar },
    { loggedInUser }
) => {
    let avatarUrl = null;
    if (avatar) {
        const { filename, createReadStream } = await avatar;
        const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
        const readStream = createReadStream();
        const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
        readStream.pipe(writeStream);
        avatarUrl = `http://localhost:4000/static/${newFilename}`;
    }
    let uglyPassword = null;
    if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await client.user.update({
        where: { id: loggedInUser.id },
        data: {
            firstName,
            lastName,
            userName,
            email,
            bio,
            ...(avatarUrl && { avatar: avatarUrl }),
            ...(uglyPassword && { password: uglyPassword }),
        },
    });
    if (updatedUser.id) {
        return {
            ok: true,
        };
    } else {
        return {
            ok: false,
            error: "Could not update profile.",
        };
    }
};

export default {
    Upload: GraphQLUpload,
    Mutation: {
        editProfile: protectedResolver(resolverFn),
    },
};
