import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";

@Module({
    providers: [
        PrismaService,
    ],
    exports: [
        PrismaService,
        AttachmentsRepository,
        NotificationsRepository,
    ],
})
export class DatabaseModule {}