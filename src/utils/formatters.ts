import { format, formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatCurrency(amount: number, withCents: boolean = false): string {
    const formatter = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: withCents ? 2 : 0,
        maximumFractionDigits: withCents ? 2 : 0,
    });
    return formatter.format(amount);
}

export function formatPercent(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: Date | string | number): string {
    const d = new Date(date);
    return format(d, 'dd.MM.yyyy', { locale: ru });
}

export function formatDateTime(date: Date | string | number): string {
    const d = new Date(date);
    return format(d, 'dd.MM.yyyy, HH:mm', { locale: ru });
}

export function formatMonthYearRu(b: Date): string {
    return format(b, 'MMM yyyy', { locale: ru });
}

export function formatDayMonthRu(b: Date): string {
    return format(b, 'dd MMM', { locale: ru });
}

export function formatRelativeTime(date: Date | string | number): string {
    const d = new Date(date);
    const now = new Date();
    return formatDistance(d, now, {
        addSuffix: true,
        locale: ru,
        includeSeconds: true
    });
}

export function formatDocumentNumber(number: number, padding: number = 6): string {
    return number.toString().padStart(padding, '0');
}

export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
    }
    return phone;
}

export function maskName(fullName: string): string {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
        const lastName = parts[0];
        const firstName = parts[1].charAt(0) + '.';
        const patronymic = parts[2] ? parts[2].charAt(0) + '.' : '';
        return `${lastName} ${firstName} ${patronymic}`.trim();
    }
    return fullName;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function roundToTwo(value: number): number {
    return Math.round(value * 100) / 100;
}

export function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}