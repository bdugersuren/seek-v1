import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Prisma } from "../generated/prisma-client";
import { AudienceLevelInput, AudienceTypeInput } from "./dto/audience.dto";

@Injectable()
export class AudienceService {
  constructor(private readonly prisma: PrismaService) {}
  private async write<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await this.prisma.$transaction(fn, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
      } catch (e) {
        const code = (e as { code?: string }).code;
        if (code === "P2034" && attempt < 2) continue;
        if (code === "P2002")
          throw new ConflictException({
            code: "DUPLICATE_CODE",
            message: "Code already exists",
          });
        if (code === "P2003")
          throw new ConflictException({
            code: "IN_USE",
            message: "Item is in use; deactivate it instead",
          });
        if (code === "P2025") throw new NotFoundException("Item not found");
        if (code === "P2034")
          throw new ConflictException({
            code: "CONCURRENT_UPDATE",
            message: "Concurrent change; retry",
          });
        throw e;
      }
    }
    throw new ConflictException("Concurrent change; retry");
  }
  private fields(dto: AudienceTypeInput | AudienceLevelInput, create: boolean) {
    if (!dto || typeof dto !== "object" || Array.isArray(dto))
      throw new BadRequestException("Invalid input");
    const out: { name?: string; code?: string; isActive?: boolean } = {};
    if (create || dto.name !== undefined) {
      if (typeof dto.name !== "string" || !dto.name.trim())
        throw new BadRequestException("Name required");
      out.name = dto.name.trim();
    }
    if (create) {
      if (typeof dto.code !== "string" || !/^[A-Z0-9_-]+$/.test(dto.code))
        throw new BadRequestException("Uppercase code required");
      out.code = dto.code;
    }
    if (dto.isActive !== undefined) {
      if (typeof dto.isActive !== "boolean")
        throw new BadRequestException("Invalid active status");
      out.isActive = dto.isActive;
    }
    return out;
  }
  private optional(value: unknown): string | null | undefined {
    if (value === undefined) return undefined;
    if (value === null) return null;
    if (typeof value !== "string")
      throw new BadRequestException("Invalid text value");
    return value.trim() || null;
  }
  async types() {
    const rows = await this.prisma.audienceType.findMany({
      include: { _count: { select: { levels: true } } },
      orderBy: { name: "asc" },
    });
    return rows.map(({ _count, ...row }) => ({
      ...row,
      levelCount: _count.levels,
    }));
  }
  levels(audienceTypeId?: string) {
    return this.prisma.audienceLevel.findMany({
      where: audienceTypeId ? { audienceTypeId } : undefined,
      orderBy: [{ orderIndex: "asc" }, { code: "asc" }],
    });
  }
  saveType(dto: AudienceTypeInput, id?: string) {
    const fields = this.fields(dto, !id),
      description = this.optional(dto.description);
    return this.write(async (tx) => {
      if (id) {
        const old = await tx.audienceType.findUnique({ where: { id } });
        if (!old) throw new NotFoundException("Type not found");
        if (dto.code !== undefined && dto.code !== old.code)
          throw new BadRequestException("Code cannot change");
        return tx.audienceType.update({
          where: { id },
          data: { ...fields, description },
        });
      }
      return tx.audienceType.create({
        data: {
          ...fields,
          name: fields.name!,
          code: fields.code!,
          description,
        },
      });
    });
  }
  saveLevel(dto: AudienceLevelInput, id?: string) {
    const fields = this.fields(dto, !id);
    const order = dto.orderIndex !== undefined ? dto.orderIndex : dto.rank;
    if (
      order !== undefined &&
      (!Number.isInteger(order) || order < 0 || order > 2147483647)
    )
      throw new BadRequestException("Order must be a nonnegative integer");
    const externalCode = this.optional(dto.externalCode);
    return this.write(async (tx) => {
      const old = id
        ? await tx.audienceLevel.findUnique({ where: { id } })
        : null;
      if (id && !old) throw new NotFoundException("Level not found");
      if (old && dto.code !== undefined && dto.code !== old.code)
        throw new BadRequestException("Code cannot change");
      if (
        old &&
        dto.audienceTypeId !== undefined &&
        dto.audienceTypeId !== old.audienceTypeId
      )
        throw new BadRequestException("Audience type cannot change");
      const typeId = old?.audienceTypeId || dto.audienceTypeId;
      if (typeof typeId !== "string" || !typeId)
        throw new BadRequestException("Audience type required");
      if (!(await tx.audienceType.findUnique({ where: { id: typeId } })))
        throw new NotFoundException("Type not found");
      const kind = dto.levelKind;
      if (
        kind !== undefined &&
        kind !== null &&
        !["GROUP", "GRADE_LEVEL", "LEVEL"].includes(kind) &&
        kind !== old?.levelKind
      )
        throw new BadRequestException("Invalid level kind");
      const parentId =
        dto.parentId === undefined ? old?.parentId || null : dto.parentId;
      if (parentId !== null && (typeof parentId !== "string" || !parentId))
        throw new BadRequestException("Invalid parent");
      let cursor = parentId;
      const visited = new Set<string>();
      while (cursor) {
        if (cursor === id || visited.has(cursor))
          throw new BadRequestException("Hierarchy cycle");
        visited.add(cursor);
        const parent = await tx.audienceLevel.findUnique({
          where: { id: cursor },
        });
        if (!parent) throw new NotFoundException("Parent not found");
        if (parent.audienceTypeId !== typeId)
          throw new BadRequestException("Parent belongs to another type");
        cursor = parent.parentId;
      }
      const data = {
        ...fields,
        parentId,
        orderIndex: order,
        levelKind: kind,
        externalCode,
      };
      return id
        ? tx.audienceLevel.update({ where: { id }, data })
        : tx.audienceLevel.create({
            data: {
              ...data,
              name: fields.name!,
              code: fields.code!,
              audienceTypeId: typeId,
              orderIndex: order ?? 1,
            },
          });
    });
  }
  deleteType(id: string) {
    return this.write(async (tx) => {
      const row = await tx.audienceType.findUnique({
        where: { id },
        include: {
          _count: {
            select: { levels: true, contexts: true, audienceRules: true },
          },
        },
      });
      if (!row) throw new NotFoundException("Type not found");
      if (Object.values(row._count).some((n) => n > 0))
        throw new ConflictException({
          code: "IN_USE",
          message: "Item is in use; deactivate it instead",
        });
      return tx.audienceType.delete({ where: { id } });
    });
  }
  deleteLevel(id: string) {
    return this.write(async (tx) => {
      const row = await tx.audienceLevel.findUnique({
        where: { id },
        include: {
          _count: {
            select: { children: true, contexts: true, audienceRules: true },
          },
        },
      });
      if (!row) throw new NotFoundException("Level not found");
      if (Object.values(row._count).some((n) => n > 0))
        throw new ConflictException({
          code: "IN_USE",
          message: "Item is in use; deactivate it instead",
        });
      return tx.audienceLevel.delete({ where: { id } });
    });
  }
}
