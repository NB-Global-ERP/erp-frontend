import type {TrainingGroup, GroupParticipant, TrainingGroupCalculated} from '@/types/erp.types.ts';

export function calculateGroupCost(pricePerPerson: number, participantsCount: number): number {
    return pricePerPerson * participantsCount;
}

export function calculateAverageProgress(participants: GroupParticipant[]): number {
    if (participants.length === 0) return 0;

    const sum = participants.reduce((acc, p) => acc + p.progressPercent, 0);
    return Math.round(sum / participants.length);
}

export function getGroupCalculatedFields(
    group: TrainingGroup,
    participants: GroupParticipant[]
): TrainingGroupCalculated {
    const participantCount = participants.length;
    const totalCost = calculateGroupCost(group.pricePerPerson, participantCount);
    const averageProgress = calculateAverageProgress(participants);

    return {
        participantCount,
        totalCost,
        averageProgress,
    };
}

export function calculateSpecificationTotals(groups: TrainingGroup[]): {
    totalAmount: number;
    vatAmount: number;
    totalWithVat: number;
} {
    const totalAmount = groups.reduce((sum, group) => sum + (group.pricePerPerson * (group.participants?.length || 0)), 0);
    const vatAmount = totalAmount * 0.22;
    const totalWithVat = totalAmount + vatAmount;

    return { totalAmount, vatAmount, totalWithVat };
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}