import { format, formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';
import {COLORS} from "@/utils/constants.ts";

export function formatCurrency(amount: number, withCents: boolean = false): string {
    const formatter = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: withCents ? 2 : 0,
        maximumFractionDigits: withCents ? 2 : 0,
    });
    return formatter.format(amount);
}

export function formatPercent(value: number): string {
    return `${value}%`;
}

export function getStatusColor(statusName: string): string {
    const colors: Record<string, string> = {
        'PLANNING': COLORS.accent,
        'IN_PROCESS': COLORS.warning,
        'COMPLETED': COLORS.success,
        'CANSELED': COLORS.error,
    };
    return colors[statusName] || COLORS.gray;
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

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function roundToTwo(value: number): number {
    return Math.round(value * 100) / 100;
}