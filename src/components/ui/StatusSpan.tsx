
interface StatusSpanProps {
    row: {
        statusName: string;
        color: string;
    };
}

export function StatusSpan({ row }: StatusSpanProps) {
    const statusName = row.statusName;


    return (
        <div
            className={`w-4 h-4 rounded-full`}
            style={{backgroundColor: row.color}}
            title={statusName}
        />
    );
}

export default StatusSpan;