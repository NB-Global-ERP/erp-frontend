import { format } from 'date-fns';
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

export function getFirstName(fullName: string) {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    return parts[1] || '';
}

export function getMiddleName(fullName: string) {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    return parts[2] || '';
}

export function getLastName(fullName: string) {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    return parts[0] || '';
}

export function formatMonthYearRu(b: Date): string {
    return format(b, 'MMM yyyy', { locale: ru });
}

export function formatDayMonthRu(b: Date): string {
    return format(b, 'dd MMM', { locale: ru });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}