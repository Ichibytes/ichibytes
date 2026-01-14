import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === "string") {
      return this.sanitizeString(value);
    }

    if (typeof value === "object" && value !== null) {
      return this.sanitizeObject(value);
    }

    return value;
  }

  private sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "");
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeValue(item));
    }

    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = this.sanitizeValue(obj[key]);
      }
    }
    return sanitized;
  }

  private sanitizeValue(value: any): any {
    if (typeof value === "string") {
      return this.sanitizeString(value);
    }
    if (typeof value === "object" && value !== null) {
      return this.sanitizeObject(value);
    }
    return value;
  }
}
