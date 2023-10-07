import { Comment as PrismaComment, User as PrismaUser } from "@prisma/client";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

type PrismaCommentWithAutor = PrismaComment & {
    author: PrismaUser;
}

export class PrismaCommentWithAuthorMapper {
    static toDomain(raw: PrismaCommentWithAutor): CommentWithAuthor {
        return CommentWithAuthor.create({
            commentId: new UniqueEntityID(raw.id),
            authorId: new UniqueEntityID(raw.authorId),
            author: raw.author.name,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
}